export {};
import { MerkleHeap } from "./MerkleHeap.js";
import {
    matrixProp,
    CircuitValue,
    Field,
    SmartContract,
    PublicKey,
    method,
    PrivateKey,
    Mina,
    state,
    State,
    isReady,
    Poseidon,
    AccountUpdate,
    Bool,
    Experimental,
    Circuit,
    DeployArgs,
    Permissions,
    UInt64,
    Int64,
    MerkleTree,
    Signature,
  } from 'snarkyjs';
  import { customAlphabet } from 'nanoid';
await isReady;

const height =3 
const heap = new MerkleHeap(height);
let proofsEnabled = false;
export class MerkleHeapDemo extends SmartContract{
    @state (Field) heapRoot = State <Field>();
    @method initState (initialValue:Field){
        heap.insert(initialValue)
        //Check if the min is equal to the initial value as it is just one
        let firstRoot= heap.findMin()
        this.heapRoot.set(firstRoot!)
        console.log('FIRST ROOT', firstRoot?.toBigInt())
    }
    // @method fillHeap (height:Field){
    //     let nodes = (2 ** height) - 1;
    //     const nanoid = customAlphabet('1234567890', 2);
    //     //Basic method for filling the entire Heap  with Random values
    //     for (let index = 0; index < nodes; index++) {
    //       // console.log('Insertion Index =>',index);
    //       let valueInsterted =Field(nanoid())
    //       heap.insert(valueInsterted);
    //       console.log('Value inserted =>',valueInsterted, 'in iteration number',index )
    //     }

    // } 
    @method insertValue(value:Field){
        heap.insert(value)
        const newRoot = heap.findMin()
        this.heapRoot.set(newRoot!)
    }
    // @method deleteValue(valueToDelete:Field){
    // }
    @method deleteMin(){
        return heap.deleteMin()
    }
    // @method deleteElementAtIndex(index:Field){
    //     const indexBigInt=index.toBigInt()
        
    // }
    // //Demo of basic method to check if an element is in the queue
    // @method inQueue (value:Field){
    //     const isInQueue=heap.inQueue(value)
    //     return isInQueue
    // }
}
// ZK APP SETUP
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();
let zkapp = new MerkleHeapDemo(zkappAddress);
const Local = Mina.LocalBlockchain({ proofsEnabled });
Mina.setActiveInstance(Local);

//Test Accounts
let bonsaiTestPk =Local.testAccounts[0].privateKey;
let bonsaiTestAccount = bonsaiTestPk.toPublicKey();
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
  await localDeploy(zkapp,zkappKey,bonsaiTestPk)
//   await initialTx.send();    

async function insertAnddeleteElement (value:Field){
    let tx = await Mina.transaction(bonsaiTestPk, () => {
        // zkapp.inser
        zkapp.insertValue(value);
        //This should be Field(1)
        let firstDeletion=zkapp.deleteMin()
        console.log('First deletion => ',firstDeletion?.toBigInt())
      });
        await tx.prove();
        tx.sign([zkappKey]);
        await tx.send();
}
await insertAnddeleteElement(Field(22))
/**
 * `txn.send()` returns a pending transaction with two methods - `.wait()` and `.hash()`
 * `.hash()` returns the transaction hash
 * `.wait()` automatically resolves once the transaction has been included in a block. this is redundant for the LocalBlockchain, but very helpful for live testnets
 */
// await pendingDeployTx.wait();


// function insert(){
//     // this.heapRoot.assertEquals(newRoot!)
//     // const testNewRoot = this.heapRoot.get()
//     // console.log('NEW ROOT', testNewRoot)
// }
