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

console.log("------------------------------------------");
merkleHeap.insert(Field(6))
merkleHeap.insert(Field(5))
merkleHeap.insert(Field(4))
console.log('FATHER',merkleHeap.getMerkleTreeLeaf(0n)?.toBigInt())
console.log('FATHER2',merkleHeap.getMerkleTreeLeaf(1n)?.toBigInt())
console.log('FATHER3',merkleHeap.getMerkleTreeLeaf(2n)?.toBigInt())
const firstElement= merkleHeap.deleteMin()
const seconfElement= merkleHeap.deleteMin()
const thirdElement= merkleHeap.deleteMin()
console.log('Element deleted => ',firstElement?.toBigInt())
console.log('Element 2 deleted => ',seconfElement?.toBigInt())
console.log('Element 3 deleted => ',thirdElement?.toBigInt())

console.log("\nSearching elements...");
let elementFound = merkleHeap.findElement(new Field(5));
console.log("Element found: ", elementFound?.toString());

// Add a testing for accessing an index bigger than the leafCount of the Merkle Tree

