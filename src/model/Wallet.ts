import { STARTING_BALANCE } from "../config/config";
import cryptoHash from "../utils/cryptoHash";
import { ec, EcType, SignatureType } from "../utils/cryptoSign";

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
}
