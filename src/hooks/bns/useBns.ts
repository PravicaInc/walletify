import { createWalletGaiaConfig } from '@stacks/wallet-sdk';
import { useState } from 'react';
import { gaiaUrl, Subdomains } from '../../shared/constants';
import {
  registerSubdomain,
  validateSubdomain,
} from '../../shared/profileUtils';
import { useAccounts } from '../useAccounts/useAccounts';
import { useProgressState } from '../useProgressState';
import { useWallet } from '../useWallet/useWallet';

export const useBns = () => {
  const { walletState } = useWallet();
  const { selectedAccountState } = useAccounts();
  const { loading, setLoading, setFailure, setSuccess, success, failure } =
    useProgressState();
  const [registrationError, setRegistrationError] = useState<string>('');

  const registerUserSubdomain = async (subdomain: string) => {
    setRegistrationError('');
    try {
      setLoading();
      const isSubdomainInvalid = await validateSubdomain(
        subdomain,
        Subdomains.STACKS,
      );
      if (walletState && selectedAccountState) {
        if (isSubdomainInvalid) {
          setRegistrationError(isSubdomainInvalid);
          setFailure();
          return isSubdomainInvalid;
        } else {
          const gaiaHubConfig = await createWalletGaiaConfig({
            gaiaHubUrl: gaiaUrl,
            wallet: walletState,
          });
          await registerSubdomain({
            account: selectedAccountState,
            username: subdomain,
            gaiaHubConfig: gaiaHubConfig,
          });
        }
      }
      setSuccess();
    } catch (err) {
      setRegistrationError(err as string);
      setFailure();
    }
  };

  return {
    registerUserSubdomain,
    isRegistering: loading,
    registrationSuccessful: success,
    registrationFailure: failure,
    registrationError,
  };
};
