import { ITransactionMinerProps } from "../interfaces/ITransactionMiner";

export class TransactionMiner {
  public blockchain;
  public transactionPool;
  public wallet;
  public pubSub;

  constructor({
    blockchain,
    transactionPool,
    wallet,
    pubsub,
  }: ITransactionMinerProps) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.wallet = wallet;
    this.pubSub = pubsub;
  }

  mineTransactions() {}
}
