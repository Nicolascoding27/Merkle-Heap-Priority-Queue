import {
    isReady,
    shutdown,
    Poseidon,
    Field,
    MerkleTree,
    MerkleWitness,
} from 'snarkyjs';

describe('Merkle Heap', () => {

    beforeAll(async () => {
        await isReady
    });

    afterAll(async () => {
        setTimeout(shutdown, 0);
    });

});