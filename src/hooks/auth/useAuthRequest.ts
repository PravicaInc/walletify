import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  makeAuthResponse,
  updateWalletConfigWithApp,
  Wallet,
} from '@stacks/wallet-sdk/dist';
import { useUpdateAtom } from 'jotai/utils';
import { Alert, Linking } from 'react-native';
import { gaiaUrl } from '../../shared/constants';
import { authRequestState } from './authStore';
import { isWebUri } from 'valid-url';
import { AuthRequestState } from '../../models/auth';

export function useAuthRequest() {
  return useUpdateAtom(authRequestState);
}

export function isValidUrl(str: string) {
  return !!isWebUri(str);
}

export const finishSignIn = async (
  { decodedAuthRequest, authRequest, appName, appIcon }: AuthRequestState,
  currentWallet: Wallet,
  accountIndex: number,
  cb: Function,
) => {
  const account = currentWallet?.accounts[accountIndex];
  if (!decodedAuthRequest || !authRequest || !account || !currentWallet) {
    return;
  }
  const appURL = new URL(decodedAuthRequest.redirect_uri);
  const gaiaHubConfig = await createWalletGaiaConfig({
    gaiaHubUrl: gaiaUrl,
    wallet: currentWallet,
  });
  const walletConfig = await getOrCreateWalletConfig({
    wallet: currentWallet,
    gaiaHubConfig,
    skipUpload: true,
  });
  await updateWalletConfigWithApp({
    wallet: currentWallet,
    walletConfig,
    gaiaHubConfig,
    account,
    app: {
      origin: appURL.origin,
      lastLoginAt: new Date().getTime(),
      scopes: decodedAuthRequest.scopes,
      appIcon: appIcon as string,
      name: appName as string,
    },
  });
  const authResponse = await makeAuthResponse({
    gaiaHubUrl: gaiaUrl,
    appDomain: appURL.origin,
    transitPublicKey: decodedAuthRequest.public_keys[0],
    scopes: decodedAuthRequest.scopes,
    account,
  });
  const dangerousUri = decodedAuthRequest.redirect_uri;
  if (!isValidUrl(dangerousUri) || dangerousUri.includes('javascript')) {
    Alert.alert('Cannot proceed auth with malformed url');
  }
  const redirect = `${dangerousUri}?authResponse=${authResponse}`;
  Alert.alert(
    'Attention',
    `You are giving permission to ${appName} to access the app private key assigned to ${decodedAuthRequest.domain_name}`,
    [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Accept',
        onPress: async () => {
          cb();
          Linking.openURL(redirect);
        },
      },
    ],
  );
};
