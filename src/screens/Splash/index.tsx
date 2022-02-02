import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useRef } from 'react';
import { Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import BottomSheet from '@gorhom/bottom-sheet';
import { ThemeContext } from '../../contexts/Theme/theme';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
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

  const handleAuthenticationSuccessful = (
    password: string,
    seedPhrase: string,
  ) => {
    Keyboard.dismiss();
    passwordBottomSheet.current?.close();
    dispatch(
      StackActions.replace('Home', {
        password,
        seedPhrase,
      }),
    );
  };

  const { validateUserCredentials } = useUnlockWallet(
    handleAuthenticationSuccessful,
    passwordBottomSheet,
  );

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    console.log(hasLoaded);
    if (hasLoaded) {
      const timer = setTimeout(() => {
        if (encryptedSeedPhrase) {
          validateUserCredentials();
        } else if (!viewedOnBoarding) {
          dispatch(StackActions.replace('OnBoarding'));
        } else {
          dispatch(StackActions.replace('WalletSetup'));
        }
      }, 200);
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
        isNotDismissible
        handleNextAction={handleAuthenticationSuccessful}
      />
    </SafeAreaView>
  );
};

export default Splash;
