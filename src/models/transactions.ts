import type {
  MempoolTransaction,
  Transaction,
  TransactionStatus,
  MempoolTransactionStatus,
  TokenTransferTransactionMetadata,
} from '@stacks/stacks-blockchain-api-types';

export type Tx = MempoolTransaction | Transaction | SubmittedTransaction;
export type StacksTransactionStatus =
  | TransactionStatus
  | MempoolTransactionStatus
  | 'submitted';

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

export type SubmittedTransaction = {
  internal_id: string;
  tx_id: string;
  sender_address: string;
  tx_status: 'submitted' | 'failed';
} & TokenTransferTransactionMetadata;
