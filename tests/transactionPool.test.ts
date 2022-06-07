import { TransactionPool } from "../src/model/TransactionPool";
import { Transaction } from "../src/model/Transaction";
import { Wallet } from "../src/model/Wallet";

describe("TransactionPool", () => {
  let transactionPool: TransactionPool;
  let transaction: Transaction;
  let sender: Wallet;

  beforeEach(() => {
    sender = new Wallet();
    transactionPool = new TransactionPool();
    transaction = new Transaction({
      senderWallet: sender,
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
  describe("existingTransaction()", () => {
    it("returns an existing transaction given an input address", () => {
      transactionPool.setTransaction(transaction);
      expect(
        transactionPool.existingTransaction({ inputAddress: sender.publicKey })
      ).toBe(transaction);
    });
  });
});
