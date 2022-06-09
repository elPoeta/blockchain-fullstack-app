import { Blockchain } from "../src/model/Blockchain";
import { Block } from "../src/model/Block";
import { Transaction } from "../src/model/Transaction";
import cryptoHash from "../src/utils/cryptoHash";
import { Wallet } from "../src/model/Wallet";

describe("Blockchain", () => {
  let blockchain: Blockchain;
  let newChain: Blockchain;
  let originalChain: Block[];

  beforeEach(() => {
    blockchain = new Blockchain();
    newChain = new Blockchain();
    originalChain = blockchain.chain;
  });

  it("contains a chain instance array", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });

  it("starts with genesis block", () => {
    expect(blockchain.chain[0]).toEqual(Block.genesis());
  });

  it("add new block to the chain", () => {
    const newData = "first chain";
    blockchain.addBlock(newData);
    expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(newData);
  });

  describe("isValidChain", () => {
    describe("when chain does no starts with genesis block", () => {
      it("return false", () => {
        blockchain.chain[0].data = "fake-data";
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });

    describe("when chain starts with genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock("Web3");
        blockchain.addBlock("Ethereum");
        blockchain.addBlock("Solidity");
      });
      describe("and a lastHash reference has changed", () => {
        it("return false", () => {
          blockchain.chain[2].previusHash = "broken-hash";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and chain contain a block with inalid field", () => {
        it("return false", () => {
          blockchain.chain[2].data = "broken-data";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and the chain contains a block with a jumped difficulty", () => {
        it("returns false", () => {
          const lastBlock = blockchain.chain[blockchain.chain.length - 1];
          const previusHash = lastBlock.hash;
          const timestamp = Date.now();
          const nonce = 0;
          const data: unknown = "";
          const difficulty = lastBlock.difficulty - 3;
          const hash = cryptoHash(
            timestamp,
            previusHash,
            difficulty,
            nonce,
            data
          );
          const badBlock = new Block({
            nonce,
            difficulty,
            timestamp,
            previusHash,
            hash,
            data,
          });

          blockchain.chain.push(badBlock);

          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
      });

      describe("and chain does not contain any invalid block", () => {
        it("return true", () => {
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
        });
      });
    });
  });

  describe("replaceChain", () => {
    let errorMock: () => {};
    let logMock: () => {};
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();
      global.console.error = errorMock;
      global.console.log = logMock;
    });
    describe("when the new chain is not longer", () => {
      beforeEach(() => {
        newChain.chain[0].data = "chain";
        blockchain.replaceChain(newChain.chain, false);
      });
      it("does not replace the chain", () => {
        expect(blockchain.chain).toEqual(originalChain);
      });

      it("logs an error", () => {
        expect(errorMock).toHaveBeenCalled();
      });
    });

    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newChain.addBlock("Web3");
        newChain.addBlock("Ethereum");
        newChain.addBlock("Solidity");
      });
      describe("and the chain is invalid", () => {
        beforeEach(() => {
          newChain.chain[2].hash = "fake-hash";
          blockchain.replaceChain(newChain.chain, false);
        });
        it("does not replace the chain", () => {
          expect(blockchain.chain).toEqual(originalChain);
        });

        it("logs an error", () => {
          expect(errorMock).toHaveBeenCalled();
        });
      });

      describe("and the chain is valid", () => {
        beforeEach(() => {
          blockchain.replaceChain(newChain.chain, false);
        });
        it("replaces the chain", () => {
          expect(blockchain.chain).toEqual(newChain.chain);
        });
        it("logs about the chain replacement", () => {
          expect(logMock).toHaveBeenCalled();
        });
      });
    });

    describe("and the `validateTransactions` flag is true", () => {
      it("calls validTransactionData()", () => {
        const validTransactionDataMock = jest.fn();
        blockchain.validTransactionData = validTransactionDataMock;
        newChain.addBlock("fake-data");
        blockchain.replaceChain(newChain.chain, true);
        expect(validTransactionDataMock).toHaveBeenCalled();
      });
    });
  });

  describe("valid transaction data", () => {
    let transaction: Transaction;
    let rewardTransaction: Transaction;
    let wallet: Wallet;

    beforeEach(() => {
      wallet = new Wallet();
      transaction = wallet.createTransaction({
        recipient: new Wallet().publicKey,
        amount: 70,
      });
      rewardTransaction = Transaction.rewardTransaction({
        minerWallet: wallet,
      });
    });

    describe("and the transaction data is valid", () => {
      it("returns true", () => {
        newChain.addBlock([transaction, rewardTransaction]);
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          true
        );
      });
    });

    describe("and the transaction data has multiple rewards", () => {
      it("returns false", () => {
        newChain.addBlock([transaction, rewardTransaction, rewardTransaction]);
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
      });
    });

    describe("and the transaction data has at least one malformed outputMap", () => {
      describe("and the transaction is not a reward transaction", () => {
        it("returns false", () => {
          transaction.outputMap[wallet.publicKey] = 999999;
          newChain.addBlock([transaction, rewardTransaction]);
          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);
        });
      });

      describe("and the transaction is a reward transaction", () => {
        it("returns false", () => {
          rewardTransaction.outputMap[wallet.publicKey] = 999999;
          newChain.addBlock([transaction, rewardTransaction]);
          expect(
            blockchain.validTransactionData({ chain: newChain.chain })
          ).toBe(false);
        });
      });
    });

    describe("and the transaction data has at least one malformed input", () => {
      it("returns false", () => {
        wallet.balance = 9000;

        const evilOutputMap = {
          [wallet.publicKey]: 8900,
          fooRecipient: 100,
        };
        const evilTransaction = {
          input: {
            timestamp: Date.now(),
            amount: wallet.balance,
            address: wallet.publicKey,
            signature: wallet.sign(evilOutputMap),
          },
          outputMap: evilOutputMap,
        };
        newChain.addBlock([evilTransaction, rewardTransaction]);
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
      });
    });
    describe("and a block contains multiple identical transactions", () => {
      it("returns false", () => {
        newChain.addBlock([
          transaction,
          transaction,
          transaction,
          rewardTransaction,
        ]);
        expect(blockchain.validTransactionData({ chain: newChain.chain })).toBe(
          false
        );
      });
    });
  });
});
