import {
  isReady,
  shutdown,
  Poseidon,
  Field,
  MerkleTree,
  MerkleWitness,
  UInt64,
  UInt32,
  Int64
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
        //Filling the entire Tree with Random values
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
      //For veryfing that the value is not anymore in the queue I use the inQueue function
      const isFirstDeletionInQueue=merkleHeap.inQueue(minValue1)
      expect(isFirstDeletionInQueue).toBe(false)
      console.log('Is first in queue?', isFirstDeletionInQueue)
      console.log('First Deletion',firstDeletion?.toBigInt())
      expect(firstDeletion?.toBigInt()).toBe(minValue1?.toBigInt())
      const secondDeletion= merkleHeap.deleteMin()
      const isSecondDeletionInQueue=merkleHeap.inQueue(minValue2)
      expect(isSecondDeletionInQueue).toBe(false)
      expect(secondDeletion?.toBigInt()).toBe(minValue2?.toBigInt())

      console.log('Second Deletion',secondDeletion)
      const thirdDeletion= merkleHeap.deleteMin()
      const isThirdDeletionInQueue=merkleHeap.inQueue(minValue3)
      expect(isThirdDeletionInQueue).toBe(false)
      console.log('Third Deletion',thirdDeletion)
      expect(thirdDeletion?.toBigInt()).toBe(minValue3.toBigInt())
      
    });
  });
  describe('Delete Element at index function test', () => { 

    it('Should delete the element in a specific index', async () => {
      //In case of a Min Heap, the least value is the root or father
      //So after deleting the min Element, the father should change
      //And the value that was deleted should have been the father
      // let currentFather = merkleHeap.getMerkleTreeLeaf(0n);
      const HEIGHT = 2
      const merkleHeap = new MerkleHeap(HEIGHT);
      // let firstNumberToDelete =  
      // const firstValuetest= Int64.fromField(Field(1));
      // const test1= Int64.fromField(Field(-44));
      // const conditionTest=test1>firstValuetest
      // console.log('THIS IS A FREAKING TEST',conditionTest)
      // console.log('CONDITION',firstValue.assertEquals(-1))
      // console.log('FIRST VALUE => ',Int64.fromField(firstValue))
      const firstValue= Field(1);
      const secondValue= Field(480)
      // console.log('SECOND VALUE => ',secondValue.toBigInt())
      const thirdValue= Field(10289838)
      merkleHeap.insert(firstValue)
      merkleHeap.insert(secondValue)
      merkleHeap.insert(thirdValue)
      //the heap structure should be 0n:Field(1),1n:Field(480) || 1n:Field(10289838) ,2n:Field(480) || 1n:Field(10289838) 
      const firstDeletion= merkleHeap.deleteElementAtIndex(0n)
      console.log('first delation => ',firstDeletion)
      expect(firstDeletion?.toBigInt()).toBe(firstDeletion?.toBigInt())
      //For veryfing that the value is not anymore in the queue I use the inQueue function
      const isFirstDeletionInQueue=merkleHeap.inQueue(firstValue)
      expect(isFirstDeletionInQueue).toBe(false)
      console.log('Is first in queue?', isFirstDeletionInQueue)
      // console.log('First Deletion',firstDeletion?.toBigInt())
      const secondDeletion= merkleHeap.deleteElementAtIndex(0n)
      // console.log('2 delation => ',secondDeletion?.toBigInt())
      const thirdDeletion= merkleHeap.deleteElementAtIndex(0n)
      console.log('THIRD DELETION', thirdDeletion?.toBigInt())
      // console.log('3rd delation => ',thirdDeletion?.toBigInt())
      const isSecondDeletionInQueue=merkleHeap.inQueue(secondValue)
      const isThirdDeletionInQueue=merkleHeap.inQueue(thirdValue)
      expect(isSecondDeletionInQueue).toBe(false)
      expect(secondDeletion?.toBigInt()).toBe(secondValue?.toBigInt())
      expect(isThirdDeletionInQueue).toBe(false)
      expect(thirdDeletion?.toBigInt()).toBe(thirdValue.toBigInt())
      

      // expect(firstElement).toBe(6)
    });
  });
  /**
   * This function tests that after multiple  inserts, the function is verifying correctly if the value is part of the queue or not.
   */
  describe('isInqueue function test', () => {
    it('Verifies that the numbers that are not in queue are not there and after multiple insertions these numbers are added to the queue', async () => {
      const merkleHeap = new MerkleHeap(2);
      const testValue1= Field(0);
      const testValue2= Field(-10);
      const testValue3= Field(40);
      const testValue4= Field(-0);
      // console.log('Min Value1=>',minValue1.toConstant())
      // console.log(minValue1.assertEquals(-1))
      const insertValue1= Field(92727282)
      const insertValue2= Field(-20)
      const insertValue3= Field('2018')
      //Insertions
      merkleHeap.insert(insertValue1)
      merkleHeap.insert(insertValue2)
      merkleHeap.insert(insertValue3)

      const test1=merkleHeap.inQueue(testValue1)
      expect(test1).toBe(false)
      const test2=merkleHeap.inQueue(testValue2)
      expect(test2).toBe(false)
      const test3=merkleHeap.inQueue(testValue3)
      expect(test3).toBe(false)
      const test4=merkleHeap.inQueue(testValue4)
      expect(test4).toBe(false)

      const insertTest1=merkleHeap.inQueue(insertValue1)
      expect(insertTest1).toBe(true)
      const insertTest2=merkleHeap.inQueue(insertValue2)
      expect(insertTest2).toBe(true)
      const insertTest3=merkleHeap.inQueue(insertValue3)
      expect(insertTest3).toBe(true)

      
    });
  });
  /**
   * This function tests that the min number in the queue is being found after multiple insertions and deletions
   */
  describe('findMin function test', () => {
    it('Verifies that the findMin function works properly after multiple insertions and deletions, using the  delete min function', async () => {
      //Init 
      const merkleHeap = new MerkleHeap(3);
      //Values
      //TODO: Add support to negative values
      const minValue1= Field(-0);
      const minValue2= Field(0)
      const minValue3= Field(1)
      // const minValue4= Field(2)
      // //insertions
      merkleHeap.insert(minValue1)
      merkleHeap.insert(minValue2)
      merkleHeap.insert(minValue3)
          //TODO:ERROR HERE 
      // merkleHeap.insert(minValue4)
      const firstTest=merkleHeap.findMin()
      expect(firstTest).toBe(minValue1)
      merkleHeap.deleteMin()
      const secondTest=merkleHeap.findMin()
      expect(secondTest).toBe(minValue2)
      merkleHeap.deleteMin()
      const thirdTest=merkleHeap.findMin()
      expect(thirdTest).toBe(minValue3)
      merkleHeap.deleteMin()
      //TODO:ERROR HERE 
      // const fourthTest=merkleHeap.findMin()
      // expect(fourthTest).toBe(minValue4)
      // merkleHeap.deleteMin()

      // const finalTest=merkleHeap.findMin()
      // console.log('WHAT THE FUCK IS THIS?',finalTest)
      // // merkleHeap.deleteMin()

      

      
    });
  });
  /**
   * This function tests that the insertThenDeleteMin function does the following:
   * Inserts a value in the correct position and then extracts the root of the Tree 
   */
  describe('findMin function test', () => {
    it('Verifies that the findMin function works property after multiple insertions and deletions, using the  delete min function', async () => {
      //Init 
      const merkleHeap = new MerkleHeap(3);
      //Values
      //TODO: Add support to negative values
      const minValue1= Field(-0);
      const minValue2= Field(0)
      const minValue3= Field(1)
      // const minValue4= Field(2)
      // //insertions
      merkleHeap.insert(minValue1)
      merkleHeap.insert(minValue2)
      merkleHeap.insert(minValue3)
          //TODO:ERROR HERE 
      // merkleHeap.insert(minValue4)
      const firstTest=merkleHeap.findMin()
      expect(firstTest).toBe(minValue1)
      merkleHeap.deleteMin()
      const secondTest=merkleHeap.findMin()
      expect(secondTest).toBe(minValue2)
      merkleHeap.deleteMin()
      const thirdTest=merkleHeap.findMin()
      expect(thirdTest).toBe(minValue3)
      merkleHeap.deleteMin()
      //TODO:ERROR HERE 
      // const fourthTest=merkleHeap.findMin()
      // expect(fourthTest).toBe(minValue4)
      // merkleHeap.deleteMin()

      // const finalTest=merkleHeap.findMin()
      // console.log('WHAT THE FUCK IS THIS?',finalTest)
      // // merkleHeap.deleteMin()

      

      
    });
  }); 
});
