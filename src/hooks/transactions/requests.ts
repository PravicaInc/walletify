import { atom } from 'jotai';
import { TransactionPayload } from '@stacks/connect';
import { SignaturePayload } from '../../shared/types';

export const transactionRequestTokenPayloadState = atom<
  | ((TransactionPayload | SignaturePayload) & {
      redirect_uri: string;
      metadata: any;
    })
  | undefined
>(undefined);
