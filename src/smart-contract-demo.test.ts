import * as dotenv from 'dotenv';
dotenv.config();
import {
  isReady,
  shutdown,
  Poseidon,
  Field,
  UInt64,
  UInt32,
  Mina,
  PublicKey,
  PrivateKey,
  fetchAccount,
  Signature,
  AccountUpdate,
} from 'snarkyjs';

import { MerkleHeapDemo } from './demo';
import { waitUntilNextBlock } from './network';

await isReady;
///Setup
const zkAppTestContractAddress = process.env.MERKLE_HEAP_DEMO_CONTRACT || '';
const isBerkeley = process.env.TEST_NETWORK === 'true';

// variables
let zkAppTest: MerkleHeapDemo;

beforeAll(async () => {
  zkAppTest = new MerkleHeapDemo(
    PublicKey.fromBase58(zkAppTestContractAddress)
  );
});

describe('Merkle Heap Smart Contract Demo', () => {
  let Blockchain;
  let zkAppTestPrivateKey: any; // private key
  let zkAppTestPublicKey: any; // public key
  let localBlockchain: any;

  beforeAll(async () => {
    // Mina Blockchain instance : local | berkeley
    if (isBerkeley) {
      Blockchain = Mina.Network({
        mina: 'https://proxy.berkeley.minaexplorer.com/graphql',
        archive: 'https://archive-node-api.p42.xyz/',
      });
      zkAppTestPrivateKey = PrivateKey.fromBase58(
        'EKDxPsv3rnVvk8MVp7A5UNaL9pTVXnQkYdikuas3pHPHJyBCn4YC'
      );
      zkAppTestPublicKey = PublicKey.fromBase58(
        'B62qn3vM657WqhbgCtuxuxLjL6fSEkSu1CTJqSQA7uhcR9gc3uEKT1Z'
      );
      console.log('On Berkley ready');
      Mina.setActiveInstance(Blockchain);
    } else {
      localBlockchain = Mina.LocalBlockchain();
      zkAppTestPrivateKey = localBlockchain.testAccounts[0].privateKey;
      zkAppTestPublicKey = zkAppTestPrivateKey.toPublicKey();
      Mina.setActiveInstance(localBlockchain);
    }
    // compile contracts
    await MerkleHeapDemo.compile();
    // set initial state

    await zkAppTest.initState(Field(1));
  });

  afterAll(() => {
    setInterval(shutdown, 0);
  });

  /**
   * Waits until next block on Berkeley by polling the network state
   * or mocks the next block on local blockchain by increasing block length by 1.
   */
  async function waitForNextBlock() {
    if (isBerkeley) {
      // provide parameters to overwrite defaults for number of retries and polling interval
      await waitUntilNextBlock();
    } else {
      localBlockchain.setBlockchainLength(
        localBlockchain.getNetworkState().blockchainLength.add(1)
      );
    }
  }

  it('should insert a new value', async () => {
    const valueToInsert = Field(2);
    const insertTx = await Mina.transaction(
      { sender: zkAppTestPublicKey, fee: 200_000_000 },
      () => {
        zkAppTest.insertValue(valueToInsert);
      }
    );
    await insertTx.prove();
    await insertTx.sign([zkAppTestPrivateKey]).send();
    await waitForNextBlock();

    console.log('Farm.deposit() successful', insertTx.toPretty());

    const account = await fetchAccount({ publicKey: zkAppTestPublicKey });
    // const root = account.state.get(zkAppTest.heapRoot);
    // insertTx.transaction.accountUpdates.expect(root).toEqual(valueToInsert);
  });
});
