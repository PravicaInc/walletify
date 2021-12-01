import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import BigNumber from 'bignumber.js';
import deepEqual from 'deep-equal';
import { getStxAddress } from '@stacks/wallet-sdk/dist';
import { atomWithAsyncStorage } from '../../shared/jotai';
import { wallet } from '../useWallet/walletStore';
import {
  AccountBalanceResponseBigNumber,
  AccountBalanceStxKeys,
  accountBalanceStxKeys,
  AccountStxBalanceBigNumber,
  AccountWithAddress,
} from '../../models/account';
import {
  selectedNetwork,
  transactionNetworkVersionState,
} from '../useNetwork/networkStore';
import {
  accountBalancesAnchoredClient,
  accountBalancesUnanchoredClient,
} from '../apiClients/apiClients';
import { PrincipalWithNetworkUrl } from '../../models/apiClient';

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

export const accountBalancesUnanchoredBigNumberState = atomFamily<
  PrincipalWithNetworkUrl,
  AccountBalanceResponseBigNumber
>(
  ({ principal, networkUrl }) =>
    atom(get => {
      const balances = get(
        accountBalancesUnanchoredClient({ principal, networkUrl }),
      );
      const stxBigNumbers = Object.fromEntries(
        accountBalanceStxKeys.map(key => [
          key,
          new BigNumber(balances.stx[key]),
        ]),
      ) as Record<AccountBalanceStxKeys, BigNumber>;

      const stx: AccountStxBalanceBigNumber = {
        ...balances.stx,
        ...stxBigNumbers,
      };
      return {
        ...balances,
        stx,
      };
    }),
  deepEqual,
);

export const currentAccountBalancesUnanchoredState = atom(get => {
  const principal = get(selectedAccount)?.address;
  const networkUrl = get(selectedNetwork).url;
  if (!principal) {
    return;
  }
  return get(
    accountBalancesUnanchoredBigNumberState({ principal, networkUrl }),
  );
});

export const accountBalancesAnchoredBigNumber = atomFamily<
  PrincipalWithNetworkUrl,
  AccountBalanceResponseBigNumber
>(
  ({ principal, networkUrl }) =>
    atom(get => {
      const balances = get(
        accountBalancesAnchoredClient({ principal, networkUrl }),
      );
      const stxBigNumbers = Object.fromEntries(
        accountBalanceStxKeys.map(key => [
          key,
          new BigNumber(balances.stx[key]),
        ]),
      ) as Record<AccountBalanceStxKeys, BigNumber>;
      const stx: AccountStxBalanceBigNumber = {
        ...balances.stx,
        ...stxBigNumbers,
      };
      return {
        ...balances,
        stx,
      };
    }),
  deepEqual,
);

export const currentAnchoredAccountBalancesState = atom(get => {
  const principal = get(selectedAccount)?.address;
  const networkUrl = get(selectedNetwork).url;
  if (!principal) {
    return;
  }
  return get(accountBalancesAnchoredBigNumber({ principal, networkUrl }));
});

export const accountAvailableStxBalanceState = atomFamily<
  string,
  BigNumber | undefined
>(
  principal =>
    atom(get => {
      const networkUrl = get(selectedNetwork).url;
      const balances = get(
        accountBalancesAnchoredBigNumber({ principal, networkUrl }),
      );
      if (!balances) {
        return new BigNumber(0);
      }
      return balances.stx.balance.minus(balances.stx.locked);
    }),
  deepEqual,
);

export const currentAccountAvailableStxBalanceState = atom(get => {
  const principal = get(selectedAccount)?.address;
  if (!principal) {
    return;
  }
  return get(accountAvailableStxBalanceState(principal));
});
