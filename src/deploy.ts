import { MerkleHeapDemo } from './demo.js';
import { AccountUpdate, Mina, PrivateKey, PublicKey, shutdown } from 'snarkyjs';
// setup
// const Local = Mina.LocalBlockchain();
// Mina.setActiveInstance(Local);
async function deploy(berkley: boolean) {
  // TODO: fix account keys
  // TODO: fix deploy setup
  let zkAppTestPublicKey: PublicKey;
  let zkAppTestPrivateKey: PrivateKey;

  let instance;
  if (berkley) {
    instance = Mina.Network('https://proxy.berkeley.minaexplorer.com/graphql');
    zkAppTestPrivateKey = PrivateKey.fromBase58(
      'EKDxPsv3rnVvk8MVp7A5UNaL9pTVXnQkYdikuas3pHPHJyBCn4YC'
    );
    zkAppTestPublicKey = PublicKey.fromBase58(
      'B62qn3vM657WqhbgCtuxuxLjL6fSEkSu1CTJqSQA7uhcR9gc3uEKT1Z'
    );
    Mina.setActiveInstance(instance);
  } else {
    instance = Mina.LocalBlockchain();
    zkAppTestPrivateKey = instance.testAccounts[0].privateKey;
    zkAppTestPublicKey = zkAppTestPrivateKey.toPublicKey();
    Mina.setActiveInstance(instance);
  }

  //ZK APPs setup
  const zkAppTestKey = PrivateKey.random();
  const zkAppAddress = zkAppTestKey.toPublicKey();

  // create an instance of the smart contract
  const zkAppTest = new MerkleHeapDemo(zkAppAddress);

  console.log('Deploying and initializing MerkleHeap Test contract App...');

  //Setup
  let { verificationKey } = await MerkleHeapDemo.compile();
  console.log('Verification key: ', verificationKey);
  let defaultFee = 300_000_000;

  // //Deployment logic
  let deployTx = await Mina.transaction(
    { sender: zkAppTestPublicKey, fee: defaultFee },
    () => {
      AccountUpdate.fundNewAccount(zkAppTestPublicKey);
      zkAppTest.deploy({ zkappKey: zkAppTestKey });
    }
  );
  await deployTx.prove();
  await deployTx.sign([zkAppTestKey, zkAppTestPrivateKey]).send();
  console.log(`DEPLOY SUCCESFUL AT => ${zkAppAddress.toBase58()}`);
  await shutdown();
}
await deploy(true);
