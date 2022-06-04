import express, { Response, Request } from "express";
import { Blockchain } from "./model/Blockchain";

const app = express();

const blockchain = new Blockchain();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/v1/blocks", (req: Request, res: Response) => {
  res.status(200).json({ blocks: blockchain.chain });
});

app.post("/api/v1/mine", (req: Request, res: Response) => {
  const { data } = req.body;
  blockchain.addBlock(data);
  res.redirect("/api/v1/blocks");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server ran in port: ${PORT}`);
});
