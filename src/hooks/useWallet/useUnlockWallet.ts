import { useCallback, useContext } from 'react';
import SecureKeychain from '../../shared/SecureKeychain';
import { decryptMnemonic } from '@stacks/encryption';
import { UserCredentials } from 'react-native-keychain';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';

export const useUnlockWallet = (
  handleGoNext: (password: string, seedPhrase: string) => any,
  ref: any,
) => {
  const {
    userPreference: { encryptedSeedPhrase, hasSetBiometric },
  } = useContext(UserPreferenceContext);

  const validateUserCredentials = useCallback(async () => {
    if (hasSetBiometric) {
      try {
        const userCredentials = await SecureKeychain.getGenericPassword();
        const seedDecrypted = await decryptMnemonic(
          encryptedSeedPhrase,
          (userCredentials as UserCredentials).password,
        );
        await handleGoNext(
          (userCredentials as UserCredentials).password,
          seedDecrypted,
        );
      } catch (e) {
        ref.current?.snapToIndex(0);
      }
    } else {
      ref.current?.snapToIndex(0);
    }
  }, [encryptedSeedPhrase, hasSetBiometric]);
  return {
    validateUserCredentials,
  };
};
