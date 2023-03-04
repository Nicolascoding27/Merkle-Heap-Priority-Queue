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

// TODO: Write a test of this
let hashOfZeroes = Poseidon.hash([new Field(0), new Field(0)]);
let hashOfHashOfZeroes = Poseidon.hash([hashOfZeroes, hashOfZeroes]);
console.log("Hash of hash of zeroes: ", hashOfHashOfZeroes.toString());


merkleHeap.insert(new Field(10));
console.log("Merkle Heap after insert: ", merkleHeap);
// TODO: Test that the value in the level 1 equals the hash of Field(10) and Field(0)

let leafAfterInsert = merkleHeap.getMerkleTreeLeaf( 0n );
console.log("Inserted leaf: ", leafAfterInsert?.toString());

merkleHeap.insert(new Field(8));
console.log("Merkle Heap after insert: ", merkleHeap);

console.log("Leafs (0n): ", merkleHeap.getMerkleTreeLeaf( 0n )?.toString());
console.log("Leafs (1n): ", merkleHeap.getMerkleTreeLeaf( 1n )?.toString());

console.log("\nSearching elements...");
let elementFound = merkleHeap.findElement(new Field(8));
console.log("Element found: ", elementFound?.toString());

// Add a testing for accessing an index bigger than the leafCount of the Merkle Tree

