import {useCallback, useContext, useEffect, useState} from 'react';
import {DeviceEventEmitter, Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {useProgressState} from './useProgressState';

export const useAuthentication = () => {
  const [userData, setUserData] = useState(undefined);
  const {
    setFailure,
    setLoading,
    setSuccess,
    success,
    failure,
    loading,
  } = useProgressState();

  useEffect(() => {
    setLoading();
    getUserData();
  }, [userData]);

  const getUserData = async () => {
    const data = await AsyncStorage.getItem('userData');
    console.warn(data);
    if (data) {
      setUserData(data);
      setSuccess();
    } else {
      setFailure();
    }
  };

  const signIn = async () => {
    const signedIn = AsyncStorage.setItem('userData', 'eh').then(() => {
      setUserData({
        user: 'heeh',
        password: 'heeh',
      });
    });
    return signedIn;
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('userData');
    setUserData(undefined);
  };

  return {
    signIn,
    signOut,
    userData,
    setUserData,
    success,
    failure,
    loading,
  };
};
