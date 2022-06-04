import redis from "redis";

const CHANNELS = {
  TEST: "TEST",
};
class PubSub {
  public publisher;
  public subscriber;
  constructor() {
    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    this.subscriber.subscribe(CHANNELS.TEST, (message) => {
      console.log(message);
    });
    this.subscriber.on("message", (channel: string, message: string) =>
      this.handleMessage(channel, message)
    );
  }

  handleMessage(channel: string, message: string) {
    console.log(`Message recieve from channel ${channel}. Message: ${message}`);
  }
}

const testPubSub = new PubSub();

testPubSub.publisher.publish(CHANNELS.TEST, "foo");
