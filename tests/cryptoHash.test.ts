import cryptoHash from "../src/utils/cryptoHash";

describe("cyptoHash", () => {
  it("generates a SHA-256 hashed output", () => {
    expect(cryptoHash("elpoeta")).toEqual(
      "009929535546964a9ff5331594d54e68beed661ad6cebff24f112bd4fd6db604"
    );
  });

  it("produces the same hash with the same args in any order", () => {
    expect(cryptoHash("one", "two", "three")).toEqual(
      cryptoHash("three", "one", "two")
    );
  });
});
