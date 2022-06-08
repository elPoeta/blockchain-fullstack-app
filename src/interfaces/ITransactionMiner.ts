import { Blockchain } from "../model/Blockchain";
import { TransactionPool } from "../model/TransactionPool";
import { Wallet } from "../model/Wallet";
import { PubSub } from "../model/PubSub";

export interface ITransactionMinerProps {
  blockchain: Blockchain;
  transactionPool: TransactionPool;
  wallet: Wallet;
  pubSub: PubSub;
}
