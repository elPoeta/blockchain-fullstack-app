import { ec as Ec } from "elliptic";
import cryptoHash from "./cryptoHash";

export type ecType = Ec.KeyPair;
export type signatureType = Ec.Signature;

export const ec = new Ec("secp256k1");

export const verifySignature = ({
  publicKey,
  data,
  signature,
}: {
  publicKey: string;
  data: string;
  signature: signatureType;
}): boolean => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature);
};
