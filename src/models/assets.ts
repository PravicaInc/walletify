import BigNumber from "bignumber.js";

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

export interface Asset {
  name: string;
  contractAddress: string;
  contractName: string;
  subtitle: string;
  type: 'stx' | 'nft' | 'ft';
  balance: BigNumber;
  canTransfer?: boolean;
  hasMemo?: boolean;
  subBalance?: BigNumber;
}

export type AssetWithMeta = Asset & { meta?: FtMeta };
