import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { useEffect } from 'react';
import { apiClientState } from '../apiClients/apiClients';
import { useAccounts } from '../useAccounts/useAccounts';
import {
  accountTransactionsWithTransfersState,
  currentAccountMempoolTransactionsState,
} from './transactionsStore';

const DEFAULT_LIST_LIMIT = 50;

export const useTransactions = () => {
  const [
    accountTransactionsWithTransfers,
    setAccountTransactionsWithTransfers,
  ] = useAtom(accountTransactionsWithTransfersState);
  const [mempoolTransactions, setMempoolTransactions] = useAtom(
    currentAccountMempoolTransactionsState,
  );
  const { selectedAccountState, selectedAccountIndexState } = useAccounts();
  const api = useAtomValue(apiClientState);
  const fetchAccountTransactions = async () => {
    const data = await api.accountsApi.getAccountTransactionsWithTransfers({
      principal: selectedAccountState?.address as string,
      limit: DEFAULT_LIST_LIMIT,
    });
    setAccountTransactionsWithTransfers(data.results);
  };

  const fetchAccountMempoolTransactions = async () => {
    const data = await api.transactionsApi.getAddressMempoolTransactions({
      address: selectedAccountState?.address as string,
      limit: DEFAULT_LIST_LIMIT,
    });
    setMempoolTransactions(data.results);
  };

  useEffect(() => {
    fetchAccountTransactions();
    fetchAccountMempoolTransactions();
  }, [selectedAccountIndexState]);

  return {
    accountTransactionsWithTransfers,
    mempoolTransactions,
  };
};
