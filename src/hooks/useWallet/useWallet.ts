import { generateWallet, restoreWalletAccounts } from '@stacks/wallet-sdk/dist';
import { useCallback, useContext } from 'react';
import { useAtom } from 'jotai';
import { gaiaUrl } from '../../shared/constants';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import { wallet } from './walletStore';
import logger from '../../shared/logger';

export const useWallet = () => {
  const [walletState, setWalletState] = useAtom(wallet);
  const {
    userPreference: { encryptedSeedPhrase },
    setEncryptedSeed,
  } = useContext(UserPreferenceContext);

  const createWallet = useCallback(
    async (secretKey: string, password: string) => {
      const generatedWallet = await generateWallet({
        secretKey,
        password,
      });
      setEncryptedSeed(generatedWallet.encryptedSecretKey);
      setWalletState(generatedWallet);
    },
    [],
  );

  const restoreWallet = useCallback(
    async (secretKey: string, password: string) => {
      let generatedWallet = await generateWallet({
        secretKey,
        password,
      });
      try {
        generatedWallet = await restoreWalletAccounts({
          wallet: generatedWallet,
          gaiaHubUrl: gaiaUrl,
        });
        setEncryptedSeed(generatedWallet.encryptedSecretKey);
        setWalletState(generatedWallet);
      } catch (err) {
        logger.error(`Error Restoring Wallet Accounts, ${err}`);
      }
    },
    [],
  );
  return {
    walletState,
    setWalletState,
    encryptedSeedPhrase,
    createWallet,
    restoreWallet,
    setEncryptedSeed,
  };
};
