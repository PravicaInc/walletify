import { createContext } from 'react';
import {
  UserPreference,
  UserPreferenceContextValue,
} from './userPreferenceTypes';

export const DEFAULT_USER_PREFERENCE: UserPreference = {
  hasSetBiometric: false,
  encryptedSeedPhrase: '',
  viewedOnboarding: false,
};

export const UserPreferenceContext = createContext<UserPreferenceContextValue>({
  userPreference: DEFAULT_USER_PREFERENCE,
  setEncryptedSeed: () => null,
  setHasEnabledBiometric: () => null,
  setViewedOnboarding: () => null,
  setUserPreference: () => null,
  clearUserPreference: () => null,
});
