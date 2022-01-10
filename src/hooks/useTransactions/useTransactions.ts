import { useAtom } from 'jotai';
import { useAtomValue } from 'jotai/utils';
import { useEffect } from 'react';
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

  const fetchAccountTransactions = async () => {
    if (selectedAccountState && selectedAccountState.address) {
      const data = await api.accountsApi.getAccountTransactionsWithTransfers({
        principal: selectedAccountState?.address,
        limit: DEFAULT_LIST_LIMIT,
      });
      console.log(data);
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

  useEffect(() => {
    const fetchAccountPendingTransactions = async () => {
      try {
        setLoading();
        await fetchAccountTransactions();
        await fetchAccountMempoolTransactions();
        setSuccess();
      } catch (err) {
        console.log('fdd', err);
        setFailure();
      }
    };
    fetchAccountPendingTransactions();
  }, [selectedAccountIndexState, selectedAccountState]);

  return {
    accountTransactionsWithTransfers,
    mempoolTransactions,
    loading,
  };
};
