import { Transaction } from "./Transaction";

type transactionMapType = Record<string, Transaction>;

export class TransactionPool {
  public transactionMap: transactionMapType;
  constructor() {
    this.transactionMap = {};
  }

  setTransaction(transaction: Transaction) {
    this.transactionMap[transaction.id] = transaction;
  }
}
