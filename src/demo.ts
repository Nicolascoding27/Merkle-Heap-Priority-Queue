import { MerkleHeap } from './MerkleHeap.js';
import {
  Field,
  SmartContract,
  method,
  PrivateKey,
  Mina,
  state,
  State,
  isReady,
  AccountUpdate,
} from 'snarkyjs';
await isReady;

const height = 3;
const heap = new MerkleHeap(height);
let proofsEnabled = false;
export class MerkleHeapDemo extends SmartContract {
  @state(Field) heapRoot = State<Field>();
  @method initState(initialValue: Field) {
    heap.insert(initialValue);
    //Check if the min is equal to the initial value as it is just one
    let firstRoot = heap.findMin();
    this.heapRoot.set(firstRoot!);
    console.log('FIRST ROOT', firstRoot?.toBigInt());
  }

  @method insertValue(value: Field) {
    heap.insert(value);
    const newRoot = heap.findMin();
    this.heapRoot.set(newRoot!);
  }
  // @method deleteValue(valueToDelete:Field){
  // }
  @method deleteMin() {
    return heap.deleteMin();
  }
}
// ZK APP SETUP
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();
let zkapp = new MerkleHeapDemo(zkappAddress);
const Local = Mina.LocalBlockchain({ proofsEnabled });
Mina.setActiveInstance(Local);

//Test Accounts
let bonsaiTestPk = Local.testAccounts[0].privateKey;
// let bonsaiTestAccount = bonsaiTestPk.toPublicKey();
async function localDeploy(
  zkAppInstance: MerkleHeapDemo,
  zkAppPrivatekey: PrivateKey,
  bonsaiTestPk: PrivateKey
) {
  let initialTx = await Mina.transaction(bonsaiTestPk, () => {
    AccountUpdate.fundNewAccount(bonsaiTestPk);
    zkapp.deploy({ zkappKey: zkappKey });
    zkapp.initState(Field(1));
    console.log('Contract deployed succedfully');
  });
  await initialTx.prove();
  initialTx.sign([zkAppPrivatekey]);
  await initialTx.send();
}
await localDeploy(zkapp, zkappKey, bonsaiTestPk);
//   await initialTx.send();

async function insertAnddeleteElement(value: Field) {
  let tx = await Mina.transaction(bonsaiTestPk, () => {
    // zkapp.inser
    zkapp.insertValue(value);
    //This should be Field(1)
    let firstDeletion = zkapp.deleteMin();
    console.log('First deletion => ', firstDeletion?.toBigInt());
  });
  await tx.prove();
  tx.sign([zkappKey]);
  await tx.send();
}
await insertAnddeleteElement(Field(22));
