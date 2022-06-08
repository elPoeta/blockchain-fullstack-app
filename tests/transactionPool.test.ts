import { TransactionPool } from "../src/model/TransactionPool";
import { Transaction } from "../src/model/Transaction";
import { Wallet } from "../src/model/Wallet";
import { Blockchain } from "../src/model/Blockchain";

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

  describe("validTransactions", () => {
    let validTransactions: Transaction[];
    beforeEach(() => {
      validTransactions = [];
      const recipient = new Wallet().publicKey;
      for (let i = 0; i < 10; i++) {
        const transaction = new Transaction({
          senderWallet: sender,
          recipient,
          amount: 5,
        });
        if (i % 3 === 0) {
          transaction.input.amount = 9999;
        } else if (i % 3 === 1) {
          transaction.input.signature = new Wallet().sign("fake");
        } else {
          validTransactions.push(transaction);
        }
        transactionPool.setTransaction(transaction);
      }
    });

    it("return valid transaction", () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });
  });

  describe("clear", () => {
    it("clear transactions", () => {
      expect(transactionPool.transactionMap).toEqual({});
    });
  });

  describe("clear blockchain transactions", () => {
    it("clear the pools on any existing transactions", () => {
      const blockchain = new Blockchain();
      const expectedTransacionMap: Record<string, Transaction> = {};
      for (let i = 0; i < 6; i++) {
        const transaction = new Wallet().createTransaction({
          recipient: new Wallet().publicKey,
          amount: 15,
        });
        transactionPool.setTransaction(transaction);
        if (i % 2 === 0) {
          blockchain.addBlock([transaction]);
        } else {
          expectedTransacionMap[transaction.id] = transaction;
        }
      }
      transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });
      expect(transactionPool.transactionMap).toEqual(expectedTransacionMap);
    });
  });
});
