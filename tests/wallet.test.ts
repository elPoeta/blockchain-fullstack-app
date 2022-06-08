import { Transaction } from "../src/model/Transaction";
import { Wallet } from "../src/model/Wallet";
import { verifySignature } from "../src/utils/cryptoSign";

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
  });
});
