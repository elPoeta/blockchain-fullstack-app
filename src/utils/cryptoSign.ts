import { ec as Ec } from "elliptic";
import cryptoHash from "./cryptoHash";

export type EcType = Ec.KeyPair;
export type SignatureType = Ec.Signature;

export const ec = new Ec("secp256k1");

export const verifySignature = ({
  publicKey,
  data,
  signature,
}: {
  publicKey: string;
  data: unknown;
  signature: SignatureType | undefined;
}): boolean => {
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");
  return keyFromPublic.verify(cryptoHash(data), signature!);
};
