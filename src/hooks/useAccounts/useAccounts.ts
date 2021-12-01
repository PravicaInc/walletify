import { useAtomValue } from 'jotai/utils';
import {
  createWalletGaiaConfig,
  generateNewAccount,
  updateWalletConfig,
} from '@stacks/wallet-sdk/dist';
import {
  accountAvailableStxBalanceState,
  accounts,
  selectedAccount,
  selectedAccountIndex,
} from './accountsStore';
import { useAtom } from 'jotai';
import { wallet } from '../useWallet/walletStore';
import { gaiaUrl } from '../../shared/constants';

export const useAccounts = () => {
  const walletAccounts = useAtomValue(accounts);
  const [currentWallet, setCurrentWallet] = useAtom(wallet);
  const [selectedAccountIndexState, setSelectedAccountIndexState] =
    useAtom(selectedAccountIndex);
  const selectedAccountState = useAtomValue(selectedAccount);

  const createAccount = async () => {
    if (currentWallet) {
      const newWallet = generateNewAccount(currentWallet);
      try {
        const updateConfig = async () => {
          const gaiaHubConfig = await createWalletGaiaConfig({
            gaiaHubUrl: gaiaUrl,
            wallet: newWallet,
          });
          await updateWalletConfig({
            wallet: newWallet,
            gaiaHubConfig,
          });
        };
        await updateConfig();
      } catch (e) {
        console.error('cant update wallet config', e);
      }
      setCurrentWallet(newWallet);
    }
  };

  const switchAccount = (accountIndex: number) => {
    setSelectedAccountIndexState(accountIndex);
  };

  return {
    walletAccounts,
    selectedAccountState,
    selectedAccountIndexState,
    createAccount,
    switchAccount,
  };
};
