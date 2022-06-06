import { Transaction } from "../src/model/Transaction";
import { Wallet } from "../src/model/Wallet";

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
});
