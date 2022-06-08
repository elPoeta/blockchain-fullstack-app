import { Wallet } from "../model/Wallet";
import { SignatureType } from "../utils/cryptoSign";

export interface ITransactionProps {
  senderWallet?: Wallet;
  recipient?: string;
  amount?: number;
  input?: InputTxType;
  outputMap?: OutputMapType;
}

export type OutputMapType = Record<string, number>;

export type InputTxType = {
  timestamp: number;
  address: string;
  amount?: number;
  signature?: SignatureType;
};
