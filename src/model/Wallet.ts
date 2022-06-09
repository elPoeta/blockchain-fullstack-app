import { STARTING_BALANCE } from "../config/config";
import cryptoHash from "../utils/cryptoHash";
import { ec, EcType, SignatureType } from "../utils/cryptoSign";
import { Block } from "./Block";
import { Transaction } from "./Transaction";

type CreateTxType = {
  amount: number;
  recipient: string;
  chain?: Block[];
};
export class Wallet {
  public balance: number;
  public publicKey: string;
  public keyPair: EcType;
  constructor() {
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex", false);
  }

  sign(data: unknown): SignatureType {
    return this.keyPair.sign(cryptoHash(data), "hex");
  }

  createTransaction(createTxProps: CreateTxType): Transaction {
    const { amount, recipient, chain } = createTxProps;
    if (chain) {
      this.balance = Wallet.calculateBalance({
        address: this.publicKey,
        chain,
      });
    }
    if (amount > this.balance) throw new Error("Amount exceeds balance");
    return new Transaction({ senderWallet: this, recipient, amount });
  }

  static calculateBalance({
    chain,
    address,
  }: {
    chain: Block[];
    address: string;
  }): number {
    let hasConductedTransaction = false;
    let total = 0;
    for (let i = chain.length - 1; i > 0; i--) {
      const transactions: Transaction[] = chain[i].data as Transaction[];
      for (let transaction of transactions) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }
        const addressOutputAmount = transaction.outputMap[address];
        if (addressOutputAmount) total += addressOutputAmount;
      }
      if (hasConductedTransaction) break;
    }
    return hasConductedTransaction ? total : STARTING_BALANCE + total;
  }
}
