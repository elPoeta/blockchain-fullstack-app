import express, { Response, Request } from "express";
import axios from 'axios';
import { Blockchain } from "./model/Blockchain";
import { Block } from "./model/Block";
import { PubSub } from "./model/PubSub";

const app = express();

const DEFAULT_PORT = 4000;
const DEFAULT_ADDRESS = `http://localhost:${DEFAULT_PORT}`;
const blockchain = new Blockchain();
const pubSub = new PubSub({ blockchain });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/v1/blocks", (req: Request, res: Response) => {
  res.status(200).json({ blocks: blockchain.chain });
});

app.post("/api/v1/mine", (req: Request, res: Response) => {
  const { data } = req.body;
  blockchain.addBlock(data);
  pubSub.broadcastChain();
  res.redirect("/api/v1/blocks");
});


const syncChains = async () => {
  try {
    const { data } = await axios.get(`${DEFAULT_ADDRESS}/api/v1/blocks`);
    const { blocks }: { blocks: Block[] } = data;
    console.log(blocks)
    blockchain.replaceChain(blocks);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log('Axios error', error)
    } else {
      console.log('unexpeted error', error)

    }
  }
}

let PEER_PORT: number;

if (process.env.GENERATE_PEER_PORT === 'true') {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT! || DEFAULT_PORT;

app.listen(PORT, () => {
  console.log(`Server ran in port: ${PORT}`);
  if (PORT !== DEFAULT_PORT)
    syncChains();
});
