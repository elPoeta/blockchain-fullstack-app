import { Transaction } from "../src/model/Transaction";
import { Wallet } from "../src/model/Wallet";
import { SignatureType, verifySignature } from "../src/utils/cryptoSign";

describe("Transction", () => {
  let transaction: Transaction;
  let sender: Wallet;
  let recipient: string;
  let amount: number;
  beforeEach(() => {
    sender = new Wallet();
    recipient = "recipient_public_key";
    amount = 10;
    transaction = new Transaction({ senderWallet: sender, recipient, amount });
  });

  it("has an id", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has an outputMap", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("ouputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs the remaining balance for the sender wallet", () => {
      expect(transaction.outputMap[sender.publicKey]).toEqual(
        sender.balance - amount
      );
    });
  });

  describe("input", () => {
    it("has an input", () => {
      expect(transaction).toHaveProperty("input");
    });

    it("has timestamp", () => {
      expect(transaction.input).toHaveProperty("timestamp");
    });

    it("set the mount to sender wallet balance", () => {
      expect(transaction.input.amount).toEqual(sender.balance);
    });

    it("set thea addres to sender wallet of public key", () => {
      expect(transaction.input.address).toEqual(sender.publicKey);
    });

    it("sign input", () => {
      expect(
        verifySignature({
          publicKey: sender.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        })
      ).toBe(true);
    });
  });

  describe("validTransaction()", () => {
    describe("when the transaction is valid", () => {
      it("returns true", () => {
        expect(Transaction.isValid(transaction)).toBe(true);
      });
    });

    describe("when the transaction is invalid", () => {
      describe("and a transaction outputMap value is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.outputMap[sender.publicKey] = 999999;
          expect(Transaction.isValid(transaction)).toBe(false);
        });
      });

      describe("and the transaction input signature is invalid", () => {
        it("returns false and logs an error", () => {
          transaction.input.signature = new Wallet().sign("fake-data");
          expect(Transaction.isValid(transaction)).toBe(false);
        });
      });
    });
  });

  describe("update", () => {
    let originalSignature: SignatureType;
    let originalSenderOutput: number;
    let nextAmount: number;
    let nextRecipient: string;
    beforeEach(() => {
      originalSignature = transaction.input.signature;
      originalSenderOutput = transaction.outputMap[sender.publicKey];
      nextRecipient = new Wallet().publicKey;
      nextAmount = 10;
      transaction.update({
        senderWallet: sender,
        recipient: nextRecipient,
        amount: nextAmount,
      });
    });

    it("outputs the amount to the next recipient", () => {
      expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
    });

    it("subtract the amount from the original sender output amount", () => {
      expect(transaction.outputMap[sender.publicKey]).toEqual(
        originalSenderOutput - nextAmount
      );
    });

    it("maintains a total output tha matches the input amount", () => {
      expect(
        Object.values(transaction.outputMap).reduce(
          (total, amount) => total + amount
        )
      ).toEqual(transaction.input.amount);
    });

    it("re-signs the transaction", () => {
      expect(transaction.input.signature).not.toEqual(originalSignature);
    });
  });
});
