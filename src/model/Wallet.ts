import { STARTING_BALANCE } from "../config/config";
import cryptoHash from "../utils/cryptoHash";
import { ec, ecType, signatureType } from "../utils/cryptoSign";

export class Wallet {
  public balance: number;
  public publicKey: string;
  public keyPair: ecType;
  constructor() {
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex", false);
  }

  sign(data: unknown): signatureType {
    return this.keyPair.sign(cryptoHash(data), "hex");
  }
}
