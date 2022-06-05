export interface IBlockProps {
  timestamp: number;
  hash: string;
  previusHash: string;
  data: unknown;
  nonce: number;
  difficulty: number;
}
