import { createClient } from "redis";
import { Block } from "./Block";
import { Blockchain } from "./Blockchain";

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN"
};

export class PubSub {
  public publisher: ReturnType<typeof createClient> | null;
  public subscriber: ReturnType<typeof createClient> | null;
  public blockchain: Blockchain;

  constructor({ blockchain }: { blockchain: Blockchain }) {
    this.blockchain = blockchain;
    this.publisher = createClient();
    this.subscriber = this.publisher.duplicate();
    this.subscribeToChannels();
  }

  async subscribeToChannels() {
    await this.subscriber?.connect();
    Object.values(CHANNELS)
      .forEach(channel => this.subscribeChannel(channel));
  }

  async subscribeChannel(channel: string) {
    await this.subscriber?.subscribe(channel, (message) => this.handleMessage(channel, message));
  }

  handleMessage(channel: string, message: string) {
    if (channel === CHANNELS.BLOCKCHAIN) {
      const chain = JSON.parse(message) as Block[];
      this.blockchain.replaceChain(chain);
    } else {
      console.log(`Message recieve from channel ${channel}. Message: ${message}`);
    }
  }

  async publish({ channel, message }: { channel: string, message: string }) {
    await this.publisher?.connect();
    await this.publisher!.publish(channel, message);
  }

  broadcastChain() {
    this.publish({ channel: CHANNELS.BLOCKCHAIN, message: JSON.stringify(this.blockchain.chain) });
  }
}

