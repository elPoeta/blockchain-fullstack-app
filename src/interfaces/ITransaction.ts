import { Wallet } from "../model/Wallet";

export interface ITransactionProps {
  senderWallet: Wallet;
  recipient: string;
  amount: number;
}

export type outputMapType = Record<string, number>;
