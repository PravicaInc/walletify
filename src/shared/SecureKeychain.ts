import * as Keychain from 'react-native-keychain';

const defaultOptions = {
  service: 'id.wiseapp',
  authenticationPromptTitle: 'Authentication Required',
  authenticationPrompt: {
    title: 'Please authenticate in order to use Wise',
  },
  authenticationPromptDesc: 'Please authenticate in order to use Wise',
  fingerprintPromptTitle: 'Authentication required',
  fingerprintPromptDesc: 'Use your fingerprint to unlock Wise',
  fingerprintPromptCancel: 'Cancel',
};

export default {
  getSupportedBiometryType() {
    return Keychain.getSupportedBiometryType();
  },

  async resetGenericPassword() {
    const options = { service: defaultOptions.service };
    return Keychain.resetGenericPassword(options);
  },

  async getGenericPassword() {
    const keychainObject = await Keychain.getGenericPassword(defaultOptions);
    if (keychainObject) {
      return keychainObject;
    }
  },

  async setGenericPassword(password: string, type?: Keychain.ACCESS_CONTROL) {
    if (
      type === Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET
    ) {
      const authOptions: Keychain.Options = {
        accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
        accessControl: type,
      };
      await Keychain.setGenericPassword('wiseapp-user', password, {
        ...defaultOptions,
        ...authOptions,
      });
    }
  },
};
