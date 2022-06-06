import { uuid } from "uuidv4";
import { ITransactionProps, outputMapType } from "../interfaces/ITransaction";

export class Transaction {
  public id: string;
  public outputMap: outputMapType;

  constructor(transactionProps: ITransactionProps) {
    this.id = uuid();
    this.outputMap = this.createOutpuMap(transactionProps);
  }

  createOutpuMap(transactionProps: ITransactionProps) {
    const outputMap: outputMapType = {};
    const { senderWallet, recipient, amount } = transactionProps;
    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    return outputMap;
  }
}
