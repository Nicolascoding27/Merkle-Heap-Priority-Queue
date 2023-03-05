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
    const merkleHeap = new MerkleHeap(2);
    let merkleRoot = merkleHeap.getRoot();
    console.log(merkleRoot);
    let hashOfZeroes = Poseidon.hash([new Field(0), new Field(0)]);
    let hashOfHashOfZeroes = Poseidon.hash([hashOfZeroes, hashOfZeroes]);
    expect(hashOfHashOfZeroes).toEqual(merkleRoot);
  });

  //Tests for insert functionß
  //We need to  test that the Heap property is correct after n number of insertions
  //We use a function to fill the Merkle heap with random values and then test the Heap property
  describe('Insert function test', () => {
    it('Verifies Heap property after fill the tree for Height=3', async () => {
      //   //For H=3
      const nanoid = customAlphabet('1234567890', 4);
      const HEIGHT = 3;
      let nodes = 2 ** HEIGHT - 1;
      const merkleHeap = new MerkleHeap(HEIGHT);
      console.log('NODES=>', nodes);
      try {
        //TODO: CHANGE UNTIL WE FIX THE BUG
        //F illing the entire Tree with Random values
        for (let index = 0; index < nodes; index++) {
          // console.log('Insertion Index =>',index);
          let valueInsterted =Field(nanoid())
          merkleHeap.insert(valueInsterted);
          console.log('Value inserted =>',valueInsterted, 'in iteration number',index )
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
          console.log('LEFT CHILD VALUE', childrenLeftValue);
          let childrenRightValue = merkleHeap.getMerkleTreeLeaf(children.right);
          console.log('RIGHT CHILD VALUE ', childrenRightValue);
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
  //We need to test that after n number insertions we are deleting the min number.
  //Also we need to test that this nummber does not live in the Heap anymore. 
  describe('Delete Min function test', () => {
    it('Verifies that the min number is being deleted', async () => {
      const merkleHeap = new MerkleHeap(2);
      const minValue1= Field(1);
      // console.log('Min Value1=>',minValue1.toConstant())
      // console.log(minValue1.assertEquals(-1))
      const minValue2= Field(480)
      const minValue3= Field(10289838)
      merkleHeap.insert(minValue1)
      merkleHeap.insert(minValue2)
      merkleHeap.insert(minValue3)
      const firstDeletion= merkleHeap.deleteMin()
      console.log('First Deletion',firstDeletion?.toBigInt())
      expect(firstDeletion?.toBigInt()).toBe(minValue1?.toBigInt())
      const secondDeletion= merkleHeap.deleteMin()
      expect(secondDeletion?.toBigInt()).toBe(minValue2?.toBigInt())
      console.log('Second Deletion',secondDeletion)
      const thirdDeletion= merkleHeap.deleteMin()
      console.log('Third Deletion',thirdDeletion)
      expect(thirdDeletion?.toBigInt()).toBe(minValue3.toBigInt())
    });
  });
  // describe('Delete Min Element function test', () => {
  //   it('Should delete the least value in the heap', async () => {
  //     //In case of a Min Heap, the least value is the root or father
  //     //So after deleting the min Element, the father should change
  //     //And the value that was deleted should have been the father
  //     // let currentFather = merkleHeap.getMerkleTreeLeaf(0n);
  //     const HEIGHT = 3;
  //     let nodes = 2 ** HEIGHT - 1;
  //     const merkleHeap = new MerkleHeap(HEIGHT);
  //     // let firstNumberToDelete =
  //     merkleHeap.insert(Field(6))
  //     merkleHeap.insert(Field(4))
  //     merkleHeap.insert(Field(5))
  //     console.log('FATHER',merkleHeap.getMerkleTreeLeaf(0n)?.toBigInt())
  //     console.log('FATHER2',merkleHeap.getMerkleTreeLeaf(1n)?.toBigInt())
  //     console.log('FATHER3',merkleHeap.getMerkleTreeLeaf(2n)?.toBigInt())
  //     const firstElement= merkleHeap.deleteMin()
  //     console.log('Element deleted => ',firstElement?.toBigInt())
  //     const seconfElement= merkleHeap.deleteMin()
  //     console.log('Element 2 deleted => ',seconfElement?.toBigInt())
  //     const thirdElement= merkleHeap.deleteMin()
  //     console.log('Element 3 deleted => ',thirdElement?.toBigInt())
  //     // expect(firstElement).toBe(6)
  //   });
  // });
});
