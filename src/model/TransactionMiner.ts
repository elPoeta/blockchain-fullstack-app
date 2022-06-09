import { ITransactionMinerProps } from "../interfaces/ITransactionMiner";
import { Transaction } from "./Transaction";

export class TransactionMiner {
  public blockchain;
  public transactionPool;
  public wallet;
  public pubSub;

  constructor({
    blockchain,
    transactionPool,
    wallet,
    pubSub,
  }: ITransactionMinerProps) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubSub = pubSub;
  }

  mineTransactions() {
    const validTransactions = this.transactionPool.validTransactions();
    validTransactions.push(
      Transaction.rewardTransaction({ minerWallet: this.wallet })
    );
    this.blockchain.addBlock(validTransactions);
    this.pubSub.broadcastChain();
    this.transactionPool.clear();
  }
}
