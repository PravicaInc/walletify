import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';

const Splash: React.FC = () => {
  const {
    userPreference: { viewedOnboarding, encryptedSeedPhrase },
  } = useContext(UserPreferenceContext);

  const { dispatch } = useNavigation();

  useEffect(() => {
    if (encryptedSeedPhrase) {
      dispatch(StackActions.replace('Login'));
    } else if (!viewedOnboarding) {
      dispatch(StackActions.replace('Onboarding'));
    } else {
      dispatch(StackActions.replace('WalletSetup'));
    }
    SplashScreen.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewedOnboarding, encryptedSeedPhrase]);
  return null;
};

export default Splash;
