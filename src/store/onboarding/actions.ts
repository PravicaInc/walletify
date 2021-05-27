import {
  OnboardingActions,
  CHANGE_PAGE,
  ONBOARDING_PROGRESS,
  ScreenPaths,
  DEFAULT_PASSWORD,
  SAVE_KEY,
  SAVE_AUTH_REQUEST,
  SET_MAGIC_RECOVERY_CODE,
  SET_USERNAME,
  HAS_CREATED_PIN,
  SET_ONBOARDING_PATH,
  DELETE_AUTH_REQUEST,
} from './types';
import {decodeToken} from 'jsontokens';
import {doGenerateWallet, didGenerateWallet, WalletActions} from '../wallet';
import {ThunkAction} from 'redux-thunk';
import {decrypt} from '@stacks/keychain';
import {AppState} from '../index';
import {
  selectDecodedAuthRequest,
  selectAuthRequest,
  selectFullAppIcon,
  selectAppName,
  isValidUrl,
} from './selectors';
import {selectIdentities, selectCurrentWallet} from '../wallet/selectors';
import {JSONSchemaForWebApplicationManifestFiles} from '@schemastore/web-manifest';
import {Alert, Linking} from 'react-native';
import {
  // getAddressFromPrivateKey,
  TransactionVersion,
} from '@stacks/transactions';
import {URL} from 'react-native-url-polyfill';
import {gaiaUrl, USERNAMES_ENABLED} from '../../../constants';
interface FinalizeAuthParams {
  decodedAuthRequest: DecodedAuthRequest;
  authResponse: string;
  authRequest: string;
  appName: string | undefined;
}
export const delay = (ms = 1000) =>
  new Promise((res) => setTimeout(() => res('done'), ms));
export const finalizeAuthResponse = (
  {decodedAuthRequest, authResponse, appName}: FinalizeAuthParams,
  dismissCb,
) => {
  const dangerousUri = decodedAuthRequest.redirect_uri;
  if (!isValidUrl(dangerousUri) || dangerousUri.includes('javascript')) {
    Alert.alert('Cannot proceed auth with malformed url');
    dismissCb();
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
          dismissCb();
          await delay(500);
          Linking.openURL(redirect);
        },
      },
    ],
  );
  return;
};

export interface DecodedAuthRequest {
  public_keys: string;
  domain_name: string;
  manifest_uri: string;
  redirect_uri: string;
  scopes: string[];
  sendToSignIn: boolean;
  appDetails?: {
    name: string;
    icon: string;
  };
  client?: string;
  connectVersion?: string;
}

export interface AppManifest extends JSONSchemaForWebApplicationManifestFiles {
  appURLScheme?: string;
  bundleID?: string;
  packageName?: string;
}

export const doSetOnboardingProgress = (status: boolean): OnboardingActions => {
  return {
    type: ONBOARDING_PROGRESS,
    payload: status,
  };
};
export const doChangeScreen = (screen: ScreenPaths): OnboardingActions => {
  return {
    type: CHANGE_PAGE,
    screen,
  };
};

export const doSetPinCreated = (hasCreatedPin: boolean): OnboardingActions => {
  return {
    type: HAS_CREATED_PIN,
    hasCreatedPin,
  };
};

export const doSaveSecretKey = (secretKey: string): OnboardingActions => ({
  type: SAVE_KEY,
  secretKey,
});

export const doSetMagicRecoveryCode = (
  magicRecoveryCode: string,
): OnboardingActions => ({
  type: SET_MAGIC_RECOVERY_CODE,
  magicRecoveryCode,
});

export const doSetUsername = (username: string): OnboardingActions => ({
  type: SET_USERNAME,
  username,
});

export const doSetOnboardingPath = (
  onboardingPath?: ScreenPaths,
): OnboardingActions => ({
  type: SET_ONBOARDING_PATH,
  onboardingPath,
});

export function doCreateSecretKey(): ThunkAction<
  void,
  AppState,
  {},
  OnboardingActions | WalletActions
> {
  return async (dispatch) => {
    const wallet = await dispatch(doGenerateWallet(DEFAULT_PASSWORD));
    const secretKey = await decrypt(
      wallet.encryptedBackupPhrase,
      DEFAULT_PASSWORD,
    );
    dispatch(didGenerateWallet(wallet));
    dispatch(doSaveSecretKey(secretKey));
  };
}

const loadManifest = async (decodedAuthRequest: DecodedAuthRequest) => {
  const res = await fetch(decodedAuthRequest.manifest_uri);
  const json: AppManifest = await res.json();
  return json;
};

interface SaveAuthRequestParams {
  appName: string;
  appIcon: string;
  decodedAuthRequest: DecodedAuthRequest;
  authRequest: string;
  appURL: URL;
}

const saveAuthRequest = ({
  appName,
  appIcon,
  decodedAuthRequest,
  authRequest,
  appURL,
}: SaveAuthRequestParams): OnboardingActions => {
  return {
    type: SAVE_AUTH_REQUEST,
    appName,
    appIcon,
    decodedAuthRequest,
    authRequest,
    appURL,
  };
};

export function doSaveAuthRequest(
  authRequest: string,
): ThunkAction<void, AppState, {}, OnboardingActions> {
  return async (dispatch) => {
    try {
      const {payload} = decodeToken(authRequest);
      const decodedAuthRequest = (payload as unknown) as DecodedAuthRequest;
      let appName = decodedAuthRequest.appDetails?.name;
      let appIcon = decodedAuthRequest.appDetails?.icon;

      if (!appName || !appIcon) {
        const appManifest = await loadManifest(decodedAuthRequest);
        appName = appManifest.name;
        appIcon = appManifest.icons[0].src as string;
      }
      dispatch(
        saveAuthRequest({
          decodedAuthRequest,
          authRequest,
          appName,
          appIcon,
          appURL: new URL(decodedAuthRequest.redirect_uri),
        }),
      );
    } catch (e) {
      Alert.alert(
        'Please contact the app provider for missing informations in their manifest files, Error missing app metadata',
      );
    }
  };
}

const deleteAuthRequest = (): OnboardingActions => {
  return {
    type: DELETE_AUTH_REQUEST,
    appName: null,
    appIcon: null,
    decodedAuthRequest: null,
    authRequest: null,
    appURL: null,
  };
};

export function doDeleteAuthRequest(): ThunkAction<
  void,
  AppState,
  {},
  OnboardingActions
> {
  return async (dispatch) => {
    dispatch(deleteAuthRequest());
  };
}

export function doFinishSignIn(
  {identityIndex}: {identityIndex: number} = {identityIndex: 0},
  dismissCb,
): ThunkAction<Promise<void>, AppState, {}, OnboardingActions | WalletActions> {
  return async (dispatch, getState) => {
    const state = getState();
    const identities = selectIdentities(state);
    const decodedAuthRequest = selectDecodedAuthRequest(state);
    const authRequest = selectAuthRequest(state);
    const wallet = selectCurrentWallet(state);
    const appIcon = selectFullAppIcon(state);
    const appName = selectAppName(state);

    if (!decodedAuthRequest || !authRequest || !identities || !wallet) {
      console.warn('Uh oh! Finished onboarding without auth info.');
      dismissCb();
      return;
    }
    const appURL = new URL(decodedAuthRequest.redirect_uri);
    const currentIdentity = identities[identityIndex];
    await currentIdentity.refresh({fetchRemoteUsernames: USERNAMES_ENABLED});
    const gaiaConfig = await wallet.createGaiaConfig(gaiaUrl);
    await wallet.getOrCreateConfig({gaiaConfig, skipUpload: true});
    await wallet
      .updateConfigWithAuth({
        identityIndex,
        gaiaConfig,
        app: {
          origin: appURL.origin,
          lastLoginAt: new Date().getTime(),
          scopes: decodedAuthRequest.scopes,
          appIcon: appIcon as string,
          name: appName as string,
        },
      })
      .catch((e) => console.warn('e', e));
    const stxAddress = wallet.stacksPrivateKey
      ? wallet.getSigner().getSTXAddress(TransactionVersion.Testnet)
      : undefined;
    const authResponse = await currentIdentity.makeAuthResponse({
      gaiaUrl,
      appDomain: appURL.origin,
      transitPublicKey: decodedAuthRequest.public_keys[0],
      scopes: decodedAuthRequest.scopes,
      stxAddress,
    });
    finalizeAuthResponse(
      {
        decodedAuthRequest,
        authRequest,
        authResponse,
        appName,
      },
      dismissCb,
    );
    dispatch(didGenerateWallet(wallet));
  };
}
