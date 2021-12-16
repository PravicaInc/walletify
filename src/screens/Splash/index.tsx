import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';

const Splash: React.FC = () => {
  const {
    userPreference: { viewedOnBoarding, encryptedSeedPhrase },
  } = useContext(UserPreferenceContext);

  const { dispatch } = useNavigation();

  useEffect(() => {
    if (encryptedSeedPhrase) {
      dispatch(
        StackActions.replace('WalletUnlock', {
          resetAction: () => {
            dispatch(StackActions.replace('WalletSetup'));
          },
          nextAction: (password: string, seedPhrase: string) => {
            dispatch(
              StackActions.replace('Home', {
                password,
                seedPhrase,
              }),
            );
          },
        }),
      );
    } else if (!viewedOnBoarding) {
      dispatch(StackActions.replace('OnBoarding'));
    } else {
      dispatch(StackActions.replace('WalletSetup'));
    }
    SplashScreen.hide();
  }, [viewedOnBoarding, encryptedSeedPhrase]);
  return null;
};

export default Splash;
