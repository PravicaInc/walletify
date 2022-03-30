export interface UserPreference {
  hasSetBiometric: boolean;
  encryptedSeedPhrase: string;
  viewedOnBoarding: boolean;
  hasLoaded: boolean;
}

export type UserPreferenceContextValue = {
  stxPrice: number;
  userPreference: UserPreference;
  setEncryptedSeed: (encryptedSeed: string) => void;
  setStxPrice: (value: number) => void;
  setHasEnabledBiometric: (hasEnabledBiometric: boolean) => void;
  setViewedOnBoarding: (hasViewedOnBoarding: boolean) => void;
  clearUserPreference: () => void;
  setUserPreference: (userPreference: UserPreference) => void;
};

export enum USER_PREFERENCE_ACTIONS {
  SET_ENCRYPTED_SEED,
  SET_HAS_ENABLED_BIOMETRIC,
  SET_VIEWED_ONBOARDING,
  SET_USER_PREFERENCE,
  CLEAR_USER_PREFERENCE,
}
