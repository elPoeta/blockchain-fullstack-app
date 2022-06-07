import { TransactionPool } from "../src/model/TransactionPool";
import { Transaction } from "../src/model/Transaction";
import { Wallet } from "../src/model/Wallet";

describe("TransactionPool", () => {
  let transactionPool: TransactionPool;
  let transaction: Transaction;
  let wallet: Wallet;

  beforeEach(() => {
    wallet = new Wallet();
    transactionPool = new TransactionPool();
    transaction = new Transaction({
      senderWallet: wallet,
      recipient: new Wallet().publicKey,
      amount: 10,
    });
  });
  describe("set-Transaction", () => {
    it("adds a transaction", () => {
      transactionPool.setTransaction(transaction);
      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });
  });
});
