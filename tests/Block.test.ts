import { GENESIS_DATA, MINE_RATE } from "../src/config/config";
import cryptoHash from "../src/utils/cryptoHash";
import { Block } from "../src/model/Block";
import { hexToBinary } from "../src/utils/hexToBinary";

describe("Block", () => {
  const blockProps = {
    timestamp: 1654446893737,
    previusHash: "none",
    hash: "0000000000000000000000000000000000000000000000000000000000000000",
    data: "blockchain",
    nonce: 1,
    difficulty: 1,
  };
  const block = new Block(blockProps);
  it("has a timestamp, lastHash, hash and data property", () => {
    expect(block.timestamp).toEqual(blockProps.timestamp);
    expect(block.previusHash).toEqual(blockProps.previusHash);
    expect(block.hash).toEqual(blockProps.hash);
    expect(block.data).toEqual(blockProps.data);
    expect(block.nonce).toEqual(blockProps.nonce);
    expect(block.difficulty).toEqual(blockProps.difficulty);
  });

  describe("genesis", () => {
    const genesisBlock = Block.genesis();
    it("returns a block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });

    it("returns the genesis data", () => {
      expect(genesisBlock.hash).toEqual(GENESIS_DATA.hash);
      expect(genesisBlock.previusHash).toEqual(GENESIS_DATA.previusHash);
      expect(genesisBlock.timestamp).toEqual(GENESIS_DATA.timestamp);
      expect(genesisBlock.data).toEqual(GENESIS_DATA.data);
    });
  });

  describe("mine", () => {
    const lastBlock = Block.genesis();
    const data = "mined-block";
    const minedBlock = Block.mine({ lastBlock, data });

    it("returns a block instance", () => {
      expect(lastBlock instanceof Block).toBe(true);
    });

    it("set the `lastHash to be the hash of the lastBlock`", () => {
      expect(minedBlock.previusHash).toEqual(lastBlock.hash);
    });

    it("set data", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("set timestamp", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });

    it("create hash based on inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.nonce,
          minedBlock.difficulty,
          minedBlock.timestamp,
          minedBlock.previusHash,
          data
        )
      );
    });
    it("set hash that macht the difficulty criteria", () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty));
    });
    it("adjust the difficulty", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1,
      ];
      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("raises the difficulty for quickly mined block", () => {
      expect(
        Block.adjustDifficulty(block, block.timestamp + MINE_RATE - 100)
      ).toEqual(block.difficulty + 1);
    });

    it("lowers the difficulty for slowly mined block", () => {
      expect(
        Block.adjustDifficulty(block, block.timestamp + MINE_RATE + 100)
      ).toEqual(block.difficulty - 1);
    });
    it("has a lower limit of 1", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty(block, block.timestamp)).toEqual(1);
    });
  });
});
