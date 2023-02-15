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
  //   beforeEach(
  //     async ()=>{
  //         jest.useFakeTimers()
  //     }
  //   )
  afterAll(async () => {
    setTimeout(shutdown, 300000);
  });
  //Test for constructor function
  //If the heap was initialized succesfully so it is empty the root should correspont to the hash of the child nodes which are Field(0) and its hashes.
  //In the case of Heigh=3 the root  must be equal to the H(h(Field(0),h(Field(0))))
  it('Initializing an empty Merkle Heap', async () => {
    const merkleHeap = new MerkleHeap(3);
    let merkleRoot = merkleHeap.getRoot();

    let hashOfZeroes = Poseidon.hash([new Field(0), new Field(0)]);
    let hashOfHashOfZeroes = Poseidon.hash([hashOfZeroes, hashOfZeroes]);

    expect(hashOfHashOfZeroes).toEqual(merkleRoot);
  });

  //Tests for insert function
//   it('');
});
