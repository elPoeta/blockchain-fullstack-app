import crypto from "crypto";

const cryptoHash = (...inputs: any[]): string =>
  crypto.createHash("sha256").update(inputs.sort().join(" ")).digest("hex");

export default cryptoHash;
