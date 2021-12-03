export interface FtMeta {
  name: string;
  symbol: string;
  decimals: number;
  ftTrait?: boolean | null;
}

export interface NftMeta {
  count: string;
  subCount?: string;
  key?: string;
  total_sent: string;
  total_received: string;
}
