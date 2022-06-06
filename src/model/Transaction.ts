import { v4 } from "uuid";
import {
  ITransactionProps,
  OutputMapType,
  InputTxType,
} from "../interfaces/ITransaction";
import { verifySignature } from "../utils/cryptoSign";
import { Wallet } from "./Wallet";

type InputPropsType = {
  senderWallet: Wallet;
  outputMap: OutputMapType;
};
export class Transaction {
  public id: string;
  public outputMap: OutputMapType;
  public input: InputTxType;

  constructor(transactionProps: ITransactionProps) {
    this.id = v4();
    this.outputMap = this.createOutpuMap(transactionProps);
    this.input = this.createInput({
      senderWallet: transactionProps.senderWallet,
      outputMap: this.outputMap,
    });
  }

  createInput(inputProps: InputPropsType): InputTxType {
    const { senderWallet, outputMap } = inputProps;
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap),
    };
  }

  createOutpuMap(transactionProps: ITransactionProps) {
    const outputMap: OutputMapType = {};
    const { senderWallet, recipient, amount } = transactionProps;
    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    return outputMap;
  }

  update(transactionProps: ITransactionProps) {
    const { senderWallet, recipient, amount } = transactionProps;
    this.outputMap[recipient] = amount;
    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount;
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  static isValid(transaction: Transaction): boolean {
    const {
      outputMap,
      input: { address, amount, signature },
    } = transaction;
    const outputTotal = Object.values(outputMap).reduce(
      (total, outputAmount) => total + outputAmount
    );
    if (amount !== outputTotal) return false;
    if (!verifySignature({ publicKey: address, data: outputMap, signature }))
      return false;
    return true;
  }
}
