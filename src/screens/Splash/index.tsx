import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import BottomSheet from '@gorhom/bottom-sheet';
import { ThemeContext } from '../../contexts/Theme/theme';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import { useWallet } from '../../hooks/useWallet/useWallet';
import EnterPasswordModal from '../../components/EnterPasswordModal';
import { useUnlockWallet } from '../../hooks/useWallet/useUnlockWallet';
import WiseLogo from '../../assets/wise.svg';
import styles from './styles';

const Splash: React.FC = () => {
  const {
    userPreference: { viewedOnBoarding, encryptedSeedPhrase, hasLoaded },
  } = useContext(UserPreferenceContext);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const passwordBottomSheet = useRef<BottomSheet>(null);
  const { dispatch } = useNavigation();
  const { restoreWallet } = useWallet();

  const handleAuthenticationSuccessful = async (
    password: string,
    seedPhrase: string,
  ) => {
    Keyboard.dismiss();
    passwordBottomSheet.current?.close();
    await restoreWallet(seedPhrase, password);
    dispatch(StackActions.replace('Home'));
  };

  const onResetWallet = () => {
    dispatch(StackActions.replace('WalletSetup'));
  };

  const { validateUserCredentials } = useUnlockWallet(
    handleAuthenticationSuccessful,
    passwordBottomSheet,
  );

  useEffect(() => {
    if (hasLoaded) {
      SplashScreen.hide();
      const timer = setTimeout(() => {
        if (encryptedSeedPhrase) {
          validateUserCredentials();
        } else if (!viewedOnBoarding) {
          dispatch(StackActions.replace('OnBoarding'));
        } else {
          dispatch(StackActions.replace('WalletSetup'));
        }
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [hasLoaded]);

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <WiseLogo width={143} height={55} />
      <EnterPasswordModal
        ref={passwordBottomSheet}
        isDismissible={false}
        resetWalletCb={onResetWallet}
        handleNextAction={handleAuthenticationSuccessful}
      />
    </SafeAreaView>
  );
};

export default Splash;
