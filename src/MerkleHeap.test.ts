import {
  isReady,
  shutdown,
  Poseidon,
  Field,
  MerkleTree,
  MerkleWitness,
} from 'snarkyjs';
import { MerkleHeap } from '../src/MerkleHeap';
import { customAlphabet } from 'nanoid';
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
  //Functions

  //Test for constructor function
  //If the heap was initialized succesfully so it is empty the root should correspont to the hash of the child nodes which are Field(0) and its hashes.
  //In the case of Heigh=3 the root  must be equal to the H(h(Field(0),h(Field(0))))
  it('Initializing an empty Merkle Heap', async () => {
    const merkleHeap = new MerkleHeap(3);
    let merkleRoot = merkleHeap.getRoot();
    console.log(merkleRoot);
    let hashOfZeroes = Poseidon.hash([new Field(0), new Field(0)]);
    let hashOfHashOfZeroes = Poseidon.hash([hashOfZeroes, hashOfZeroes]);

    expect(hashOfHashOfZeroes).toEqual(merkleRoot);
  });

  //Tests for insert functionß
  //We need to  test that the Heap property is there after n number of insertions.
  describe('Insert function test', () => {
    it('Verifies Heap property after fill the tree for Height=3', async () => {
      //   //For H=3
      const nanoid = customAlphabet('1234567890', 4);
      const HEIGHT = 3;
      let nodes = 2 ** HEIGHT - 1;
      const merkleHeap = new MerkleHeap(HEIGHT);
      console.log('NODES=>', nodes);
      try {
        for (let index = 0; index < nodes; index++) {
          console.log(index);
          merkleHeap.insert(Field(nanoid()));
        }
        //  Verifying Heap property for a Min Heap
        //  # of Nodes = (2^H)-1
        //TODO:FIX

        console.log('HEIGHT=>', merkleHeap.height);
        //  The father is the root node
        let currentFather = merkleHeap.getMerkleTreeLeaf(0n);
        console.log('current number', currentFather?.toBigInt());
        for (let i = 0; i < nodes && currentFather !== null; i++) {
          console.log('ITERATION NUMBER', i);
          console.log('CHILDREN');
          let children = merkleHeap.getChildIndexesOfFather(BigInt(i));
          console.log(children);
          let childrenLeftValue = merkleHeap.getMerkleTreeLeaf(children.left);
          console.log('LEFT CHILD', childrenLeftValue);
          let childrenRightValue = merkleHeap.getMerkleTreeLeaf(children.right);
          console.log('RIGHT CHILD', childrenRightValue);
          if (childrenLeftValue !== null) {
            expect(childrenLeftValue?.toBigInt()).toBeGreaterThanOrEqual(
              currentFather.toBigInt()
            );
          }
          if (childrenRightValue !== null) {
            expect(childrenRightValue?.toBigInt()).toBeGreaterThanOrEqual(
              currentFather.toBigInt()
            );
          }
          currentFather = merkleHeap.getMerkleTreeLeaf(BigInt(i + 1));
        }
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
        throw error;
      }
    });
  });
  describe('Delete Min function test', () => {
    it('', async () => {});
  });
  describe('Delete Min Element function test', () => {
    it('Should delete the least value in the heap', async () => {
      //In case of a Min Heap, the least value is the root or father
      //So after deleting the min Element, the father should change
      //And the value that was deleted should have been the father
      let currentFather = merkleHeap.getMerkleTreeLeaf(0n);
    });
  });
});
