import { createClient } from "redis";
import { Block } from "./Block";
import { Blockchain } from "./Blockchain";
import { Transaction } from "./Transaction";
import { TransactionPool } from "./TransactionPool";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

type PubSubPropsType = {
  blockchain: Blockchain;
  transactionPool: TransactionPool;
};
export class PubSub {
  public publisher: ReturnType<typeof createClient>;
  public subscriber: ReturnType<typeof createClient>;
  public blockchain: Blockchain;
  public transactionPool: TransactionPool;

  constructor({ blockchain, transactionPool }: PubSubPropsType) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;
    this.publisher = createClient();
    this.subscriber = this.publisher.duplicate();
    this.subscribeToChannels();
  }

  async subscribeToChannels() {
    await this.subscriber.connect();
    Object.values(CHANNELS).forEach((channel) =>
      this.subscribeChannel(channel)
    );
  }

  async subscribeChannel(channel: string) {
    await this.subscriber.subscribe(channel, (message) =>
      this.handleMessage(channel, message)
    );
  }

  handleMessage(channel: string, message: string) {
    console.log(`Message recieve from channel ${channel}. Message: ${message}`);
    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        const chain = JSON.parse(message) as Block[];
        this.blockchain.replaceChain(chain, () => {
          this.transactionPool.clearBlockchainTransactions({ chain });
        });
        break;
      case CHANNELS.TRANSACTION:
        const transaction = JSON.parse(message) as Transaction;
        this.transactionPool.setTransaction(transaction);
        break;
      default:
        return;
    }
  }

  async publish({ channel, message }: { channel: string; message: string }) {
    await this.publisher.connect();
    await this.subscriber.unsubscribe(channel);
    await this.publisher.publish(channel, message);
    await this.publisher.quit();
    this.subscribeChannel(channel);
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadcastTransaction(transaction: Transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}
