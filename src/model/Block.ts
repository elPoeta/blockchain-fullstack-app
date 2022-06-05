import { GENESIS_DATA, MINE_RATE } from "../config/config";
import cryptoHash from "../utils/cryptoHash";
import { hexToBinary } from "../utils/hexToBinary";
import { IBlockProps } from "../interfaces/IBlock";

type Minetype = {
  lastBlock: Block;
  data: unknown;
};
export class Block {
  public timestamp: number;
  public hash: string;
  public previusHash: string;
  public data: unknown;
  public nonce: number;
  public difficulty;

  constructor(blockProps: IBlockProps) {
    this.timestamp = blockProps.timestamp;
    this.hash = blockProps.hash;
    this.previusHash = blockProps.previusHash;
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
    const previusHash = lastBlock.hash;
    let difficulty = lastBlock.difficulty;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      hash = cryptoHash(timestamp, previusHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );
    return new this({ nonce, difficulty, timestamp, previusHash, hash, data });
  }

  static adjustDifficulty(originalBlock: Block, timestamp: number): number {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    if (timestamp - originalBlock.timestamp > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}
