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

const heap = new MerkleHeap(3);
const height =3 
export class MerkleHeapDemo extends SmartContract{
    @state (Field) heapRoot = State <Field>();
    //Iniate the heap with 1 insertion
    @method initState (initialValue:Field){
        heap.insert(initialValue)
        //Check if the min is equal to the initial value as it is just one
        let firstRoot= heap.findMin()
        this.heapRoot.set(firstRoot!)
        console.log('FIRST ROOT', firstRoot?.toBigInt())
    }
    @method fillHeap (height:number){
        let nodes = (2 ** height) - 1;
        const nanoid = customAlphabet('1234567890', 2);
        //Basic method for filling the entire Heap  with Random values
        for (let index = 0; index < nodes; index++) {
          // console.log('Insertion Index =>',index);
          let valueInsterted =Field(nanoid())
          heap.insert(valueInsterted);
          console.log('Value inserted =>',valueInsterted, 'in iteration number',index )
        }

    } 
    @method insertValue(value:Field){
        heap.insert(value)
        const newRoot = heap.findMin()
        this.heapRoot.set(newRoot!)
    }
    @method deleteValue(valueToDelete:Field){
    }
    @method deleteMin(){
    }
    @method deleteElementAtIndex(index:bigint){
        
    }
    //Demo of basic method to check if an element is in the queue
    @method inQueue (value:Field){
        const isInQueue=heap.inQueue(value)
        return isInQueue
    }
}
// ZK APP SETUP
let zkappKey = PrivateKey.random();
let zkappAddress = zkappKey.toPublicKey();
let zkapp = new MerkleHeapDemo(zkappAddress);

function insert(){
    // this.heapRoot.assertEquals(newRoot!)
    // const testNewRoot = this.heapRoot.get()
    // console.log('NEW ROOT', testNewRoot)
}
