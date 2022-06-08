import { Wallet } from "../model/Wallet";
import { SignatureType } from "../utils/cryptoSign";

export interface ITransactionProps {
  senderWallet: Wallet;
  recipient: string;
  amount: number;
}

export type OutputMapType = Record<string, number>;

export type InputTxType = {
  timestamp: number;
  address: string;
  amount: number;
  signature: SignatureType;
};

type RewardInputType = {
  input: { address: string };
};

type RewardOutputType = {
  outputMap: { [key: string]: number };
};

export type RewardTransactionType = { id: string } & RewardInputType &
  RewardOutputType;
