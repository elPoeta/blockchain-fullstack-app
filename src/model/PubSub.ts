import { createClient } from "redis";

const CHANNELS = {
  TEST: "TEST",
};

class PubSub {
  public publisher: ReturnType<typeof createClient> | null;
  public subscriber: ReturnType<typeof createClient> | null;
  constructor() {
    this.publisher = createClient();
    this.subscriber = this.publisher.duplicate();
    this.initPubSub(CHANNELS.TEST);
  }

  async initPubSub(channel: string) {
    await this.subscriber?.connect();
    await this.subscriber?.subscribe(channel, (message) => this.handleMessage(channel, message));
  }

  handleMessage(channel: string, message: string) {
    console.log(`Message recieve from channel ${channel}. Message: ${message}`);

  }

  async sendMessage({ channel, message }: { channel: string, message: string }) {
    await this.publisher?.connect();
    await this.publisher!.publish(channel, message);
  }
}


const testPubSub = new PubSub();
testPubSub.sendMessage({ channel: CHANNELS.TEST, message: "el-poeta" });

