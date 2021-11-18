import { useAtomValue } from 'jotai/utils';
import {
  accounts,
  selectedAccount,
  selectedAccountIndex,
} from './accountsStore';
import { useAtom } from 'jotai';

export const useAccounts = () => {
  const walletAccounts = useAtomValue(accounts);
  const [selectedAccountIndexState, setSelectedAccountIndexState] =
    useAtom(selectedAccountIndex);
  const selectedAccountState = useAtomValue(selectedAccount);

  return {
    walletAccounts,
    selectedAccountState,
    selectedAccountIndexState,
    setSelectedAccountIndexState,
  };
};
