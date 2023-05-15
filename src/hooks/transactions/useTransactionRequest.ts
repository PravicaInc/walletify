import { useUpdateAtom } from 'jotai/utils';
import { transactionRequestTokenPayloadState } from './requests';

export function useTransactionRequest() {
  return useUpdateAtom(transactionRequestTokenPayloadState);
}
