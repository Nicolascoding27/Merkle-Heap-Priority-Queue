import { MerkleHeap } from './MerkleHeap';
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
  DeployArgs,
  Permissions,
} from 'snarkyjs';
await isReady;

let proofsEnabled = false;

const height = 3;
const heap = new MerkleHeap(height);

export class MerkleHeapDemo extends SmartContract {
  @state(Field) heapRoot = State<Field>();

  /**
   * Deploy function
   * @param args  verification key
   */
  deploy(args: DeployArgs) {
    super.deploy(args);

    const permissionToEdit = Permissions.proof();

    this.account.permissions.set({
      ...Permissions.default(),
      editState: permissionToEdit,
      setTokenSymbol: permissionToEdit,
      send: permissionToEdit,
      receive: permissionToEdit,
    });
  }

  @method initState(initialRoot: Field) {
    super.init();
    //Check if the min is equal to the initial value as it is just one

    this.heapRoot.set(initialRoot);
    // console.log('FIRST ROOT', firstRoot?.toBigInt());
  }

  @method insertValue(newRoot: Field) {
    this.heapRoot.set(newRoot!);
  }
}

// ----- refactor this shit
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
  heap.insert(Field(1));
  let firstRoot = heap.findMin() as Field;
  let initialTx = await Mina.transaction(bonsaiTestPk, () => {
    AccountUpdate.fundNewAccount(bonsaiTestPk);
    zkapp.deploy({ zkappKey: zkappKey });
    zkapp.initState(firstRoot);
    console.log('Contract deployed succedfully');
  });
  await initialTx.prove();
  initialTx.sign([zkAppPrivatekey]);
  await initialTx.send();

  // await MerkleHeapDemo.compile();
}
await localDeploy(zkapp, zkappKey, bonsaiTestPk);
console.log('Local deploy complete  >>>>>');

// await CompileContract();

async function insertAnddeleteElement(value: Field) {
  heap.insert(value);
  const newRoot = heap.findMin() as Field;
  let tx = await Mina.transaction(
    bonsaiTestPk,
    // { sender: bonsaiTestPublicKey },
    () => {
      // Check: Do i need to compile the contract?
      // zkapp.inser
      zkapp.insertValue(newRoot);
      // //This should be Field(1)
      // let firstDeletion = zkapp.deleteMin();
      // TODO: use Circuit.log to print the value
      // console.log('First Deletion >>>', firstDeletion);
      // console.log('First deletion => ', firstDeletion?.toBigInt());
    }
  );
  heap.deleteMin();
  await tx.prove();
  tx.sign([zkappKey]);
  await tx.send();
}
await insertAnddeleteElement(Field(22));

// TODO: follow the example and adapt to Merkle heap implementation
// https://github.com/o1-labs/o1js/blob/main/src/examples/zkapps/merkle_tree/merkle_zkapp.ts#L156
