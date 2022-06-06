import { Wallet } from "../src/model/Wallet";

describe("Wallet", () => {
  let wallet: Wallet;
  beforeEach(() => {
    wallet = new Wallet();
  });

  it("has a balance", () => {
    expect(wallet).toHaveProperty("balance");
  });

  it("has a public key", () => {
    expect(wallet).toHaveProperty("publicKey");
  });

  it("", () => {});
});
