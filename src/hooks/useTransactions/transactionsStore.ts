import type {
  MempoolTransaction,
  AddressTransactionWithTransfers,
} from '@stacks/stacks-blockchain-api-types';

import { atom } from 'jotai';

export const accountTransactionsWithTransfersState = atom<
  AddressTransactionWithTransfers[]
>([]);
export const currentAccountMempoolTransactionsState = atom<
  MempoolTransaction[]
>([]);
