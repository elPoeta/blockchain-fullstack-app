import express, { Response, Request } from "express";
import axios from "axios";
import { Blockchain } from "./model/Blockchain";
import { Block } from "./model/Block";
import { TransactionPool } from "./model/TransactionPool";
import { Wallet } from "./model/Wallet";
import { PubSub } from "./model/PubSub";

const app = express();

const DEFAULT_PORT = 4000;
const DEFAULT_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubSub = new PubSub({ blockchain });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/v1/blocks", (req: Request, res: Response) => {
  res.status(200).json({ blocks: blockchain.chain, success: true });
});

app.post("/api/v1/mine", (req: Request, res: Response) => {
  const { data } = req.body;
  blockchain.addBlock(data);
  pubSub.broadcastChain();
  res.redirect("/api/v1/blocks");
});

app.post("api/v1/transaction", (req: Request, res: Response) => {
  const { recipient, amount } = req.body;
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });
  try {
    if (!transaction) {
      transaction = wallet.createTransaction({ amount, recipient });
    } else {
      transaction.update({ senderWallet: wallet, amount, recipient });
    }
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    return res.status(400).json({ success: false, message });
  }
  transactionPool.setTransaction(transaction);
  res.status(201).json({ transaction });
});

app.get("api/v1/transaction-pool", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ transactionPool: transactionPool.transactionMap, success: true });
});
const syncChains = async () => {
  try {
    const { data } = await axios.get(`${DEFAULT_ADDRESS}/api/v1/blocks`);
    const { blocks }: { blocks: Block[] } = data;
    console.log(blocks);
    blockchain.replaceChain(blocks);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log("Axios error", error);
    } else {
      console.log("unexpeted error", error);
    }
  }
};

let PEER_PORT: number;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT! || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server ran in port: ${PORT}`);
  if (PORT !== DEFAULT_PORT) syncChains();
});
