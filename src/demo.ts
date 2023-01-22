export {};
import { MerkleHeap } from "./MerkleHeap.js";
import {MerkleTree, isReady,Field}from 'snarkyjs';

await isReady;
const merkleHeap = new MerkleHeap(2);


let bigint10 = 10n;
let result = bigint10 - 2n

console.log("Result: ", result);
// let test1 = merkleHeap.getNode(0, 0n);
// console.log('TEST1', test1)

// merkleHeap.setNode(0, 0, new Field(0));
// let test2 = merkleHeap.getNode(0, 0n);
// console.log('TEST2',test2)
// //Insert
// merkleHeap.setLeaf(0n, new Field(0));

