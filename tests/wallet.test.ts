import { Transaction } from "../src/model/Transaction";
import { Wallet } from "../src/model/Wallet";
import { Blockchain } from "../src/model/Blockchain";
import { verifySignature } from "../src/utils/cryptoSign";
import { STARTING_BALANCE } from "../src/config/config";

describe("Wallet", () => {
  let wallet: Wallet;
  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has a balance", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a public key", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("signing data", () => {
    const data = "elpoeta";

    it("verifies signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: wallet.sign(data),
        })
      ).toBe(true);
    });

    it("does not verify invalid signature", () => {
      expect(
        verifySignature({
          publicKey: wallet.publicKey,
          data,
          signature: new Wallet().sign(data),
        })
      ).toBe(false);
    });
  });

  describe("createTx", () => {
    describe("amounts exceeds the balance", () => {
      it("throws an error", () => {
        expect(() =>
          wallet.createTransaction({
            amount: 9999,
            recipient: new Wallet().publicKey,
          })
        ).toThrow("Amount exceeds balance");
      });
    });

    describe("amount is valid", () => {
      let transaction: Transaction;
      let amount: number;
      let recipient: string;
      beforeEach(() => {
        amount = 10;
        recipient = new Wallet().publicKey;
        transaction = wallet.createTransaction({ amount, recipient });
      });
      it("create an instance of transaction", () => {
        expect(transaction instanceof Transaction).toBe(true);
      });

      it("match transaction input with the wallet", () => {
        expect(transaction.input.address).toEqual(wallet.publicKey);
      });

      it("output the amount of recipient", () => {
        expect(transaction.outputMap[recipient]).toEqual(amount);
      });
    });

    describe("and a chain is passed", () => {
      it("calls Wallet.calculateBalance", () => {
        const calculateBalanceMock = jest.fn();

        const originalCalculateBalance = Wallet.calculateBalance;

        Wallet.calculateBalance = calculateBalanceMock;

        wallet.createTransaction({
          recipient: new Wallet().publicKey,
          amount: 10,
          chain: new Blockchain().chain,
        });

        expect(calculateBalanceMock).toHaveBeenCalled();

        Wallet.calculateBalance = originalCalculateBalance;
      });
    });
  });

  describe("calculate balance", () => {
    let blockchain: Blockchain;
    beforeEach(() => {
      blockchain = new Blockchain();
    });
    describe("there are no outputs for the wallet", () => {
      it("return starting balance", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(STARTING_BALANCE);
      });
    });

    describe("there are outputs for the wallet", () => {
      let transactionOne: Transaction;
      let transactionTwo: Transaction;

      beforeEach(() => {
        transactionOne = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 50,
        });
        transactionTwo = new Wallet().createTransaction({
          recipient: wallet.publicKey,
          amount: 60,
        });
        blockchain.addBlock([transactionOne, transactionTwo]);
      });

      it("adds the sum of all outputs to the wallet balance", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(
          STARTING_BALANCE +
            transactionOne.outputMap[wallet.publicKey] +
            transactionTwo.outputMap[wallet.publicKey]
        );
      });
    });

    describe("and the wallet has made a transaction", () => {
      let recentTransaction: Transaction;

      beforeEach(() => {
        recentTransaction = wallet.createTransaction({
          recipient: new Wallet().publicKey,
          amount: 30,
        });

        blockchain.addBlock([recentTransaction]);
      });

      it("returns the output amount of the recent transaction", () => {
        expect(
          Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          })
        ).toEqual(recentTransaction.outputMap[wallet.publicKey]);
      });

      describe("and there are outputs next to and after the recent transaction", () => {
        let sameBlockTransaction: Transaction;
        let nextBlockTransaction: Transaction;

        beforeEach(() => {
          recentTransaction = wallet.createTransaction({
            recipient: new Wallet().publicKey,
            amount: 60,
          });

          sameBlockTransaction = Transaction.rewardTransaction({
            minerWallet: wallet,
          });

          blockchain.addBlock([recentTransaction, sameBlockTransaction]);
          nextBlockTransaction = new Wallet().createTransaction({
            recipient: wallet.publicKey,
            amount: 75,
          });

          blockchain.addBlock([nextBlockTransaction]);
        });

        it("includes the output amounts in the returned balance", () => {
          expect(
            Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            })
          ).toEqual(
            recentTransaction.outputMap[wallet.publicKey] +
              sameBlockTransaction.outputMap[wallet.publicKey] +
              nextBlockTransaction.outputMap[wallet.publicKey]
          );
        });
      });
    });
  });
});
