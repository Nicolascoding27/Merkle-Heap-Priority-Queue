export {};
import { MerkleHeap } from "./MerkleHeap.js";
import {
    Field,
    isReady,
    MerkleTree,
    Poseidon
}from 'snarkyjs';

await isReady;
const merkleHeap = new MerkleHeap(3);

console.log("Merkle Heap: ", merkleHeap);

let merkleRoot = merkleHeap.getRoot();
console.log("Merkle root: ", merkleRoot.toString());

console.log("------------------------------------------");
merkleHeap.insert(Field(6))
merkleHeap.insert(Field(5))
merkleHeap.insert(Field(4))

merkleRoot = merkleHeap.getRoot();
console.log("Merkle root: ", merkleRoot.toString());

// Add a testing for accessing an index bigger than the leafCount of the Merkle Tree

