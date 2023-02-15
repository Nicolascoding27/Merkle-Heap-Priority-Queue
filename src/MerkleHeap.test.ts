import {
  isReady,
  shutdown,
  Poseidon,
  Field,
  MerkleTree,
  MerkleWitness,
} from 'snarkyjs';
import { MerkleHeap } from '../src/MerkleHeap';
describe('Merkle Heap', () => {
  beforeAll(async () => {
    await isReady;
  });
  beforeEach(async () => {
    await isReady;
  });
  afterAll(async () => {
    setTimeout(shutdown, 300000);
  });

  //Test for constructor function
  //If the heap was initialized succesfully so it is empty the root should correspont to the hash of the child nodes which are Field(0) and its hashes.
  //In the case of Heigh=3 the root  must be equal to the H(h(Field(0),h(Field(0))))
  it('Initializing an empty Merkle Heap',() => {
    const merkleHeap = new MerkleHeap(3);
    let merkleRoot = merkleHeap.getRoot();

    let hashOfZeroes = Poseidon.hash([new Field(0), new Field(0)]);
    let hashOfHashOfZeroes = Poseidon.hash([hashOfZeroes, hashOfZeroes]);

    expect(hashOfHashOfZeroes).toEqual(merkleRoot);
  });

  //Tests for insert functionß
  //We need to  test that the Heap property is there after n number of insertions.
  describe('Insert function test',  () => {
    //   it('');
    //For H=3
    const merkleHeap = new MerkleHeap(3);
    merkleHeap.insert(Field(10));
    merkleHeap.insert(Field(38));
    merkleHeap.insert(Field(17));
    merkleHeap.insert(Field(62));
    verifyHeapProperty(merkleHeap);
    function verifyHeapProperty(merkleHeap: MerkleHeap) {
     // await isReady;
     let nodes = 2 ^ (merkleHeap.height - 1);
     let currentFather = merkleHeap.getMerkleTreeLeaf(0n);
     for (let i = 0; i < nodes && currentFather !== null; i++) {
       let children = merkleHeap.getChildIndexesOfFather(BigInt(i));
       if (children.left !== null) {
         let childrenLeftValue = merkleHeap.getMerkleTreeLeaf(children.left);
         expect(childrenLeftValue?.toBigInt()).toBeGreaterThanOrEqual(
           currentFather.toBigInt()
         );
       }
       if (children.right !== null) {
         let childrenRightValue = merkleHeap.getMerkleTreeLeaf(children.right);
         expect(childrenRightValue?.toBigInt()).toBeGreaterThanOrEqual(
           currentFather.toBigInt()
         );
       }
       currentFather = merkleHeap.getMerkleTreeLeaf(BigInt(i + 1));
     }
   }
  });
});
