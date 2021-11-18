import { atom } from 'jotai';
import { AccountWithAddress } from '../../models/account';
import { wallet } from '../useWallet/walletStore';
import { getStxAddress } from '@stacks/wallet-sdk/dist';
import { transactionNetworkVersionState } from '../useNetwork/networkStore';
import { atomWithAsyncStorage } from '../../shared/jotai';

export const accounts = atom<AccountWithAddress[] | undefined>(get => {
  const currentWallet = get(wallet);
  const currentWalletAccounts = currentWallet?.accounts;
  const transactionVersion = get(transactionNetworkVersionState);
  if (!currentWalletAccounts) {
    return undefined;
  }
  return currentWalletAccounts?.map(account => {
    const address = getStxAddress({ account, transactionVersion });
    return {
      ...account,
      address,
    };
  });
});

export const selectedAccountIndex = atomWithAsyncStorage(
  'SELECTED_ACCOUNT_INDEX',
  0,
);

export const selectedAccount = atom<AccountWithAddress | undefined>(get => {
  const accountIndex = get(selectedAccountIndex);
  const walletAccounts = get(accounts);
  if (!accounts) {
    return undefined;
  }
  return walletAccounts ? walletAccounts[accountIndex] : undefined;
});
