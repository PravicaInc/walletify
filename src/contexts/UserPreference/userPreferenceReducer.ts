import { UserPreference, USER_PREFERENCE_ACTIONS } from './userPreferenceTypes';

const userPreferenceReducer = (
  state: UserPreference,
  action: {
    type: USER_PREFERENCE_ACTIONS;
    payload?: any;
  },
) => {
  switch (action.type) {
    case USER_PREFERENCE_ACTIONS.SET_ENCRYPTED_SEED:
      return {
        ...state,
        encryptedSeedPhrase: action.payload,
      };
    case USER_PREFERENCE_ACTIONS.SET_HAS_ENABLED_BIOMETRIC:
      return {
        ...state,
        hasSetBiometric: action.payload,
      };
    case USER_PREFERENCE_ACTIONS.SET_VIEWED_ONBOARDING:
      return {
        ...state,
        viewedOnBoarding: action.payload,
      };
    case USER_PREFERENCE_ACTIONS.SET_USER_PREFERENCE:
      return { ...action.payload };
    case USER_PREFERENCE_ACTIONS.CLEAR_USER_PREFERENCE:
      return {};
    default:
      return state;
  }
};

export default userPreferenceReducer;
