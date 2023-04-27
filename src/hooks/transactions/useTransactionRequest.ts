import { useUpdateAtom } from 'jotai/utils';
import {
  signatureRequestTokenPayloadState,
  transactionRequestTokenPayloadState,
} from './requests';

export function useTransactionRequest() {
  return useUpdateAtom(transactionRequestTokenPayloadState);
}

export function useSignatureRequest() {
  return useUpdateAtom(signatureRequestTokenPayloadState);
}
