import { atom } from 'jotai';
import { TransactionPayload } from '@stacks/connect';
import { SignaturePayload } from '../../shared/types';

export const transactionRequestTokenPayloadState = atom<
  (TransactionPayload & { redirect_uri: string; metadata: any }) | undefined
>(undefined);
export const signatureRequestTokenPayloadState = atom<
  (SignaturePayload & { redirect_uri: string; metadata: any }) | undefined
>(undefined);
