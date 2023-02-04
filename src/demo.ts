export {};
import { MerkleHeap } from "./MerkleHeap.js";
import {MerkleTree, isReady,Field}from 'snarkyjs';

await isReady;
const merkleHeap = new MerkleHeap(2);

console.log("Merkle Heap: ", merkleHeap);
// let test1 = merkleHeap.getNode(0, 0n);
// console.log('TEST1', test1)

// merkleHeap.setNode(0, 0, new Field(0));
// let test2 = merkleHeap.getNode(0, 0n);
// console.log('TEST2',test2)
// //Insert
// merkleHeap.setLeaf(0n, new Field(0));


// Add a testing for accessing an index bigger than the leafCount of the Merkle Tree

