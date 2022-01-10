import type {
  MempoolTransaction,
  Transaction,
  TransactionStatus,
  MempoolTransactionStatus
} from '@stacks/stacks-blockchain-api-types';


export type Tx = MempoolTransaction | Transaction;
export type StacksTransactionStatus = TransactionStatus | MempoolTransactionStatus;
export interface StxTransfer {
  amount: string;
  sender?: string;
  recipient?: string;
}

export interface FtTransfer {
  asset_identifier: string;
  amount: string;
  sender?: string;
  recipient?: string;
}

export ty
