import React, { useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { FINISHED_ONBOARD } from '../../shared/types';
import { StackActions, useNavigation } from '@react-navigation/native';
import SplashScreen from 'react-native-splash-screen';

export const Splash: React.FC = () => {
  const { dispatch } = useNavigation();
  useEffect(() => {
    AsyncStorage.getItem(FINISHED_ONBOARD).then(finished => {
      dispatch(StackActions.replace('Home'));
      SplashScreen.hide();
    });
  }, [dispatch]);

  return null;
};
