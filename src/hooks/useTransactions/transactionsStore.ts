import type {
  MempoolTransaction,
  AddressTransactionWithTransfers,
} from '@stacks/stacks-blockchain-api-types';
import { atom } from 'jotai';
import { SubmittedTransaction } from '../../models/transactions';

export const accountSubmittedTransactionsState = atom<SubmittedTransaction[]>(
  [],
);
export const accountTransactionsWithTransfersState = atom<
  AddressTransactionWithTransfers[]
>([]);
export const currentAccountMempoolTransactionsState = atom<
  MempoolTransaction[]
>([]);
