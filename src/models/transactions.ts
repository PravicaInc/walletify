import type {
  MempoolTransaction,
  Transaction,
} from '@stacks/stacks-blockchain-api-types';

export type Tx = MempoolTransaction | Transaction;
