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

  existingTransaction({
    inputAddress,
  }: {
    inputAddress: string;
  }): Transaction | undefined {
    const transactions = Object.values(this.transactionMap);
    return transactions.find(
      (transaction) => transaction.input.address === inputAddress
    );
  }
}
