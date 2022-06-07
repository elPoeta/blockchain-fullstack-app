import crypto from "crypto";

const cryptoHash = (...inputs: any[]): string =>
  crypto
    .createHash("sha256")
    .update(
      inputs
        .map((input) => JSON.stringify(input))
        .sort()
        .join(" ")
    )
    .digest("hex");

export default cryptoHash;
