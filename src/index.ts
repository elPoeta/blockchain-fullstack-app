import express, { Response, Request } from "express";
import cors from "cors";
import axios from "axios";
import { Blockchain } from "./model/Blockchain";
import { Block } from "./model/Block";
import { TransactionPool } from "./model/TransactionPool";
import { Wallet } from "./model/Wallet";
import { PubSub } from "./model/PubSub";
import { Transaction } from "./model/Transaction";
import { TransactionMiner } from "./model/TransactionMiner";
import { setDummyBlocks } from "./dev/dumyBlockchain";

const app = express();

const DEFAULT_PORT = 4000;
const DEFAULT_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubSub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubSub,
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.get("/api/v1/blocks", (req: Request, res: Response) => {
  res.status(200).json({ blocks: blockchain.chain, success: true });
});

app.get("/api/v1/blocks-length", (req: Request, res: Response) => {
  res.status(200).json({ length: blockchain.chain.length, success: true });
});

app.get("/api/v1/blocks/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const { length } = blockchain.chain;
  const reversedBlocs = blockchain.chain.slice().reverse();
  let startIndex = (parseInt(id) - 1) * 5;
  let endIndex = parseInt(id) * 5;
  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;
  res
    .status(200)
    .json({ blocks: reversedBlocs.slice(startIndex, endIndex), success: true });
});

app.post("/api/v1/mine", (req: Request, res: Response) => {
  const { data } = req.body;
  blockchain.addBlock(data);
  pubSub.broadcastChain();
  res.redirect("/api/v1/blocks");
});

app.post("/api/v1/transaction", (req: Request, res: Response) => {
  const { recipient, amount } = req.body;
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });
  try {
    if (!transaction) {
      transaction = wallet.createTransaction({
        amount,
        recipient,
        chain: blockchain.chain,
      });
    } else {
      transaction.update({ senderWallet: wallet, amount, recipient });
    }
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    return res.status(400).json({ success: false, message });
  }
  transactionPool.setTransaction(transaction);
  pubSub.broadcastTransaction(transaction);
  res.status(201).json({ transaction });
});

app.get("/api/v1/transaction-pool", (req: Request, res: Response) => {
  res.status(200).json({
    transactionPoolMap: transactionPool.transactionMap,
    success: true,
  });
});

app.get("/api/v1/mine-transactions", (req: Request, res: Response) => {
  transactionMiner.mineTransactions();
  res.redirect("/api/v1/blocks");
});

app.get("/api/v1/wallet", (req: Request, res: Response) => {
  const address = wallet.publicKey;
  res.status(200).json({
    success: true,
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address }),
  });
});

app.get("/api/v1/known-addresses", (req: Request, res: Response) => {
  const addressMap: Record<string, string> = {};
  for (const block of blockchain.chain as Block[]) {
    for (const transaction of block.data as Transaction[]) {
      const recipient = Object.keys(transaction.outputMap);
      recipient.forEach((recipient) => (addressMap[recipient] = recipient));
    }
  }
  res.status(200).json({ success: true, addresses: Object.keys(addressMap) });
});

const syncBlockchainState = () => {
  syncChains();
  syncTransactions();
};

const syncChains = async () => {
  try {
    const { data } = await axios.get(`${DEFAULT_ADDRESS}/api/v1/blocks`);
    const { blocks }: { blocks: Block[] } = data;
    console.log(blocks);
    blockchain.replaceChain(blocks, false);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error", error);
    } else {
      console.log("unexpeted error", error);
    }
  }
};

const syncTransactions = async () => {
  try {
    const { data } = await axios.get(
      `${DEFAULT_ADDRESS}/api/v1/transaction-pool`
    );
    const {
      transactionPoolMap,
    }: { transactionPoolMap: Record<string, Transaction> } = data;
    transactionPool.setMap(transactionPoolMap);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error", error);
    } else {
      console.log("unexpeted error", error);
    }
  }
};

setDummyBlocks(true, wallet, blockchain, transactionPool, transactionMiner);

let PEER_PORT: number;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT! || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server ran in port: ${PORT}`);
  if (PORT !== DEFAULT_PORT) {
    syncBlockchainState();
  }
});
