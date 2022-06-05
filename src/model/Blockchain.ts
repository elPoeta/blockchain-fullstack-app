import cryptoHash from "../utils/cryptoHash";
import { Block } from "./Block";

export class Blockchain {
  public chain: Block[];
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data: unknown) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mine({ lastBlock, data });
    this.chain.push(block);
  }

  static isValidChain(chain: Block[]): Boolean {
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
      return false;
    for (let i = 1; i < chain.length; i++) {
      const { nonce, difficulty, timestamp, previusHash, hash, data } =
        chain[i];
      const actuaPreviusHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;
      if (previusHash !== actuaPreviusHash) return false;
      const validHash = cryptoHash(
        timestamp,
        previusHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validHash) return false;
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }
    return true;
  }

  replaceChain(chain: Block[]) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }
    console.log("The chain replace with ", chain);
    this.chain = chain;
  }
}
