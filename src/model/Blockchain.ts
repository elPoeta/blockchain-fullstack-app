import { MINING_REWARD, REWARD_INPUT } from "../config/config";
import cryptoHash from "../utils/cryptoHash";
import { Block } from "./Block";
import { Transaction } from "./Transaction";
import { Wallet } from "./Wallet";

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

  replaceChain(
    chain: Block[],
    validateTransactions: boolean,
    onSuccess?: () => void | undefined
  ) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }
    if (!Blockchain.isValidChain(chain)) {
      console.error("The incoming chain must be valid");
      return;
    }
    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error("The incoming chain has invalid data");
      return;
    }
    console.log("The chain replace with ", chain);
    if (onSuccess) onSuccess();
    this.chain = chain;
  }

  validTransactionData({ chain }: { chain: Block[] }) {
    for (let i = 1; i < chain.length; i++) {
      const transactions: Transaction[] = chain[i].data as Transaction[];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      for (let transaction of transactions) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          if (rewardTransactionCount > 1) {
            console.error("Miner rewards exceed limit");
            return false;
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward amount is invalid");
            return false;
          }
        } else {
          if (!Transaction.isValid(transaction)) {
            console.error("Invalid transaction");
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          });

          if (transaction.input.amount !== trueBalance) {
            console.error("Invalid input amount");
            return false;
          }

          if (transactionSet.has(transaction)) {
            console.error(
              "An identical transaction appears more than once in the block"
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }

    return true;
  }
}
