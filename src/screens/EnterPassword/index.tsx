import React from 'react';
import { StackActions, useNavigation } from '@react-navigation/native';
import { Keyboard } from 'react-native';
import WalletUnlockInner from '../../components/EnterPasswordModal/WalletUnlock';
import { useWallet } from '../../hooks/useWallet/useWallet';

const EnterPassword: React.FC = () => {
  const { restoreWallet } = useWallet();
  const { dispatch } = useNavigation();
  const handleAuthenticationSuccessful = async (
    password: string,
    seedPhrase: string,
  ) => {
    Keyboard.dismiss();
    await restoreWallet(seedPhrase, password);
    dispatch(StackActions.replace('Home'));
  };

  const onResetWallet = () => {
    dispatch(StackActions.replace('WalletSetup'));
  };

  return (
    <WalletUnlockInner
      isDismissible={false}
      nextAction={handleAuthenticationSuccessful}
      resetAction={onResetWallet}
    />
  );
};

export default EnterPassword;
