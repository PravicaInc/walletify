import AsyncStorage from '@react-native-community/async-storage';
import { useCallback, useEffect, useReducer } from 'react';
import { UserPreference, USER_PREFERENCE_ACTIONS } from './userPreferenceTypes';
import { DEFAULT_USER_PREFERENCE } from './userPreferenceContext';
import userPreferenceReducer from './userPreferenceReducer';
import deepEqual from 'deep-equal';

export const USER_PREFERENCE_KEY = 'USER_PREFERENCE';

export const useUserPreference = () => {
  const [userPreference, dispatch] = useReducer(
    userPreferenceReducer,
    DEFAULT_USER_PREFERENCE,
  );

  useEffect(() => {
    AsyncStorage.getItem(USER_PREFERENCE_KEY).then(value => {
      if (value) {
        setUserPreference(JSON.parse(value));
      }
    });
  }, []);

  useEffect(() => {
    if (!deepEqual(userPreference, DEFAULT_USER_PREFERENCE)) {
      AsyncStorage.setItem(USER_PREFERENCE_KEY, JSON.stringify(userPreference));
    }
  }, [userPreference]);

  const setEncryptedSeed = useCallback((encryptedSeed: string) => {
    dispatch({
      type: USER_PREFERENCE_ACTIONS.SET_ENCRYPTED_SEED,
      payload: encryptedSeed,
    });
  }, []);

  const setHasEnabledBiometric = useCallback((hasSetBiometric: boolean) => {
    dispatch({
      type: USER_PREFERENCE_ACTIONS.SET_HAS_ENABLED_BIOMETRIC,
      payload: hasSetBiometric,
    });
  }, []);

  const setViewedOnBoarding = useCallback((viewedOnBoarding: boolean) => {
    dispatch({
      type: USER_PREFERENCE_ACTIONS.SET_VIEWED_ONBOARDING,
      payload: viewedOnBoarding,
    });
  }, []);

  const setUserPreference = useCallback((newState: UserPreference) => {
    dispatch({
      type: USER_PREFERENCE_ACTIONS.SET_USER_PREFERENCE,
      payload: newState,
    });
  }, []);

  const clearUserPreference = useCallback(() => {
    dispatch({
      type: USER_PREFERENCE_ACTIONS.CLEAR_USER_PREFERENCE,
    });
  }, []);

  return {
    userPreference,
    setEncryptedSeed,
    setHasEnabledBiometric,
    setViewedOnBoarding,
    setUserPreference,
    clearUserPreference,
  };
};
