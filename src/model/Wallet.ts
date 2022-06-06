import { STARTING_BALANCE } from "../config/config";
import { ec } from "../utils/keyHash";

export class Wallet {
  public balance: number;
  public publicKey: string;

  constructor() {
    this.balance = STARTING_BALANCE;
    this.publicKey = this.getKeyPair();
  }

  getKeyPair(): string {
    return ec.genKeyPair().getPublic().encode("hex", false);
  }
}
