export interface IBlockProps {
  timestamp: number;
  hash: string;
  lastHash: string;
  data: any[];
  nonce: number;
  difficulty: number;
}
