import express, { Response, Request } from "express";
import { Blockchain } from "./model/Blockchain";

const app = express();

const blockchain = new Blockchain();

app.get("/api/v1/blocks", (req: Request, res: Response) => {
  res.status(200).json({ blocks: blockchain.chain });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server ran in port: ${PORT}`);
});
