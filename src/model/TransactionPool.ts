import { Transaction } from "./Transaction";

type TransactionMapType = Record<string, Transaction>;

export class TransactionPool {
  public transactionMap: TransactionMapType;

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

  setMap(transactionMap: TransactionMapType) {
    this.transactionMap = transactionMap;
  }

  validTransactions(): Transaction[] {
    return Object.values(this.transactionMap).filter((transaction) =>
      Transaction.isValid(transaction)
    );
  }
}
