import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { useEffect, useState } from 'react';
import { apiClientState } from '../apiClients/apiClients';
import { useAccounts } from '../useAccounts/useAccounts';
import { useProgressState } from '../useProgressState';
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
  const { loading, setLoading, setFailure, setSuccess } = useProgressState();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAccountTransactions = async () => {
    if (selectedAccountState && selectedAccountState.address) {
      const data = await api.accountsApi.getAccountTransactionsWithTransfers({
        principal: selectedAccountState?.address,
        limit: DEFAULT_LIST_LIMIT,
      });
      setAccountTransactionsWithTransfers(data.results);
    }
  };

  const fetchAccountMempoolTransactions = async () => {
    if (selectedAccountState && selectedAccountState.address) {
      const data = await api.transactionsApi.getAddressMempoolTransactions({
        address: selectedAccountState?.address,
        limit: DEFAULT_LIST_LIMIT,
      });
      setMempoolTransactions(data.results);
    }
  };

  const fetchAccountPendingTransactions = async () => {
    try {
      setLoading();
      await fetchAccountTransactions();
      await fetchAccountMempoolTransactions();
      setSuccess();
    } catch (err) {
      setFailure();
    }
  };

  useEffect(() => {
    fetchAccountPendingTransactions();
  }, [selectedAccountIndexState, selectedAccountState]);

  const refreshTransactionsList = async () => {
    setIsRefreshing(true);
    await fetchAccountPendingTransactions();
    setIsRefreshing(false);
  };

  return {
    accountTransactionsWithTransfers,
    mempoolTransactions,
    refreshTransactionsList,
    isRefreshing,
    loading,
  };
};
