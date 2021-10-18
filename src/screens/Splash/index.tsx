import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { FINISHED_ONBOARD } from '../../shared/types';
import { StackActions, useNavigation } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';
import { useLocalization } from '../../hooks/useLocalization';
import { LANGUAGES } from '../../shared/constants';

const Splash: React.FC = () => {
  const { dispatch } = useNavigation();
  const { changeLanguage } = useLocalization();
  const initLocalization = async () => {
    await changeLanguage(LANGUAGES[0]);
  };
  useEffect(() => {
    initLocalization();
    AsyncStorage.getItem(FINISHED_ONBOARD).then(finished => {
      dispatch(StackActions.replace('WalletSetup'));
      SplashScreen.hide();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return null;
};

export default Splash;
