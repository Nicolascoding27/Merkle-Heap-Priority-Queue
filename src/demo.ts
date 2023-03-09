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

await isReady;

const heap = new MerkleHeap(3);

export class MerkleHeapDemo extends SmartContract{
    @state (Field) firstInsertion = State <Field>;
    //Iniate the heap with 1 insertion
    @method initState (initialValue:Field){
        heap.insert(initialValue)
        //Check if the min is equal to the initial value as it is just one
        let test= heap.findMin()
        console.log('TEST', test?.toBigInt())
    }
    @method fillHeap (height:Number){
        h
    }
    @method insertValue(value:Field){
        heap.insert(value)
    }
    @method deleteValue(valueToDelete:Field){

    }
    @method deleteMin(){

    }
}




