import { GENESIS_DATA, MINE_RATE } from "../config/config";
import cryptoHash from "../utils/cryptoHash";
import { hexToBinary } from "../utils/hexToBinary";
import { IBlockProps } from "../interfaces/IBlock";

type Minetype = {
  lastBlock: Block;
  data: any[];
};
export class Block {
  public timestamp: number;
  public hash: string;
  public lastHash: string;
  public data: any[];
  public nonce: number;
  public difficulty;

  constructor(blockProps: IBlockProps) {
    this.timestamp = blockProps.timestamp;
    this.hash = blockProps.hash;
    this.lastHash = blockProps.lastHash;
    this.data = blockProps.data;
    this.nonce = blockProps.nonce;
    this.difficulty = blockProps.difficulty;
  }

  static genesis(): Block {
    return new this(GENESIS_DATA);
  }

  static mine({ lastBlock, data }: Minetype): Block {
    let timestamp: number;
    let hash: string;
    let nonce = 0;
    const lastHash = lastBlock.hash;
    let difficulty = lastBlock.difficulty;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );
    return new this({ nonce, difficulty, timestamp, lastHash, hash, data });
  }

  static adjustDifficulty(originalBlock: Block, timestamp: number): number {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}
