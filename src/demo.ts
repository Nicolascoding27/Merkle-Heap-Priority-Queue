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

let hashOfZeroes = Poseidon.hash([new Field(0), new Field(0)]);
let hashOfHashOfZeroes = Poseidon.hash([hashOfZeroes, hashOfZeroes]);
console.log("Hash of hash of zeroes: ", hashOfHashOfZeroes.toString());


merkleHeap.insert(new Field(10));
console.log("Merkle Heap after insert: ", merkleHeap);

let leafAfterInsert = merkleHeap.getMerkleTreeLeaf( 0n );
console.log("Inserted leaf: ", leafAfterInsert?.toString());

merkleHeap.insert(new Field(10));
console.log("Merkle Heap after insert: ", merkleHeap);

// let test1 = merkleHeap.getNode(0, 0n);
// console.log('TEST1', test1)

// merkleHeap.setNode(0, 0, new Field(0));
// let test2 = merkleHeap.getNode(0, 0n);
// console.log('TEST2',test2)
// //Insert
// merkleHeap.setLeaf(0n, new Field(0));


// Add a testing for accessing an index bigger than the leafCount of the Merkle Tree

