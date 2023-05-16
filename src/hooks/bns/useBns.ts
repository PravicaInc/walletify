import {
  createWalletGaiaConfig,
  updateWalletConfig,
} from '@stacks/wallet-sdk/dist';
import { useState } from 'react';
import { gaiaUrl, Subdomains } from '../../shared/constants';
import {
  registerSubdomain,
  validateSubdomain,
} from '../../shared/profileUtils';
import { useAccounts } from '../useAccounts/useAccounts';
import { useProgressState } from '../useProgressState';
import { useWallet } from '../useWallet/useWallet';
import { AccountWithAddress } from '../../models/account';

export const useBns = (selectedAccount?: AccountWithAddress) => {
  const { walletState, setWalletState } = useWallet();
  const { selectedAccountState } = useAccounts();
  const chosenAccount = selectedAccount || selectedAccountState;
  const { loading, setLoading, setFailure, setSuccess, success, failure } =
    useProgressState();
  const [registrationError, setRegistrationError] = useState<string>('');

  const registerUserSubdomain = async (
    subdomain: string,
    successCB: () => void,
  ) => {
    setRegistrationError('');
    try {
      setLoading();
      const subdomainError = await validateSubdomain(
        subdomain,
        Subdomains.STACKS,
      );
      if (walletState && chosenAccount) {
        if (subdomainError) {
          setRegistrationError(subdomainError);
          setFailure();
          return;
        } else {
          const gaiaHubConfig = await createWalletGaiaConfig({
            gaiaHubUrl: gaiaUrl,
            wallet: walletState,
          });
          await registerSubdomain({
            account: chosenAccount,
            username: subdomain,
            gaiaHubConfig: gaiaHubConfig,
          });
          const updatedWalletState = {
            ...walletState,
            accounts: walletState.accounts.map(account => ({
              ...account,
              username:
                account.index === chosenAccount.index
                  ? `${subdomain}.id.stx`
                  : account.username,
            })),
          };
          setWalletState(updatedWalletState);
          await updateWalletConfig({
            wallet: updatedWalletState,
            gaiaHubConfig: gaiaHubConfig,
          });
          successCB();
        }
      }
      setSuccess();
    } catch (err) {
      setRegistrationError(
        err ? (err as string) : 'sorry Something went wrong, Try Again',
      );
      setFailure();
    }
  };

  return {
    registerUserSubdomain,
    isRegistering: loading,
    registrationSuccessful: success,
    registrationFailure: failure,
    registrationError,
    setRegistrationError,
  };
};
