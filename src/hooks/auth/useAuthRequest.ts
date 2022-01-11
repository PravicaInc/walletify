import {
  createWalletGaiaConfig,
  getOrCreateWalletConfig,
  getRootNode,
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
import { StacksNetwork } from '@stacks/network';
import { fetchPrivate, getAddressFromPrivateKey } from '@stacks/transactions';
import { BIP32Interface } from 'bip32';
import { assertIsTruthy } from '@stacks/wallet-sdk/dist/utils';
import { ECPair } from 'bitcoinjs-lib';
import { Network } from '../../models/network';

export function useAuthRequest() {
  return useUpdateAtom(authRequestState);
}

export function isValidUrl(str: string) {
  return !!isWebUri(str);
}
export enum DerivationType {
  Wallet,
  Data,
  Unknown,
}
const STX_DERIVATION_PATH = "m/44'/5757'/0'/0";
const DATA_DERIVATION_PATH = "m/888'/0'";
export function ecPairToHexString(secretKey: ECPair.ECPairInterface) {
  const ecPointHex = secretKey.privateKey!.toString('hex');
  if (secretKey.compressed) {
    return `${ecPointHex}01`;
  } else {
    return ecPointHex;
  }
}
export const deriveStxPrivateKey = ({
  rootNode,
  index,
}: {
  rootNode: BIP32Interface;
  index: number;
}) => {
  const childKey = rootNode.derivePath(STX_DERIVATION_PATH).derive(index);
  assertIsTruthy(childKey.privateKey);
  const ecPair = ECPair.fromPrivateKey(childKey.privateKey);
  return ecPairToHexString(ecPair);
};
export const deriveDataPrivateKey = ({
  rootNode,
  index,
}: {
  rootNode: BIP32Interface;
  index: number;
}) => {
  const childKey = rootNode
    .derivePath(DATA_DERIVATION_PATH)
    .deriveHardened(index);
  assertIsTruthy(childKey.privateKey);
  const ecPair = ECPair.fromPrivateKey(childKey.privateKey);
  return ecPairToHexString(ecPair);
};

const selectDerivationTypeForUsername = async ({
  username,
  rootNode,
  index,
  network,
}: {
  username: string;
  rootNode: BIP32Interface;
  index: number;
  network?: StacksNetwork;
}): Promise<DerivationType> => {
  if (network) {
    const nameInfo = await network.getNameInfo(username);
    let stxPrivateKey = deriveStxPrivateKey({ rootNode, index });
    let derivedAddress = getAddressFromPrivateKey(stxPrivateKey);
    if (derivedAddress !== nameInfo.address) {
      // try data private key
      stxPrivateKey = deriveDataPrivateKey({
        rootNode,
        index,
      });
      derivedAddress = getAddressFromPrivateKey(stxPrivateKey);
      if (derivedAddress !== nameInfo.address) {
        return DerivationType.Unknown;
      } else {
        return DerivationType.Data;
      }
    } else {
      return DerivationType.Wallet;
    }
  } else {
    // no network to determine the derivation path
    return DerivationType.Unknown;
  }
};
export const fetchFirstName = async (
  address: string,
  network: StacksNetwork,
): Promise<string | undefined> => {
  try {
    const namesResponse = await fetchPrivate(
      `${network.bnsLookupUrl}/v1/addresses/stacks/${address}`,
    );
    const namesJson = await namesResponse.json();
    if ((namesJson.names.length || 0) > 0) {
      return namesJson.names[0];
    }
  } catch (e) {}
  return undefined;
};

const selectUsernameForAccount = async ({
  rootNode,
  index,
  network,
}: {
  rootNode: BIP32Interface;
  index: number;
  network?: StacksNetwork;
}): Promise<{
  username: string | undefined;
  derivationType: DerivationType;
}> => {
  // try to find existing usernames owned by stx derivation path
  const address = deriveStxPrivateKey({ rootNode, index });
  if (network) {
    let username = await fetchFirstName(address, network);
    if (username) {
      return { username, derivationType: DerivationType.Wallet };
    } else {
      // try to find existing usernames owned by data derivation path
      const address = deriveDataPrivateKey({ rootNode, index });
      username = await fetchFirstName(address, network);
      if (username) {
        return { username, derivationType: DerivationType.Data };
      }
    }
  }
  // use wallet derivation for accounts without username
  return { username: undefined, derivationType: DerivationType.Wallet };
};

export const selectStxDerivation = async ({
  username,
  rootNode,
  index,
  network,
}: {
  username?: string;
  rootNode: BIP32Interface;
  index: number;
  network?: StacksNetwork;
}): Promise<{
  username: string | undefined;
  stxDerivationType: DerivationType;
}> => {
  if (username) {
    // Based on username, determine the derivation path for the stx private key
    const stxDerivationTypeForUsername = await selectDerivationTypeForUsername({
      username,
      rootNode,
      index,
      network,
    });
    return { username, stxDerivationType: stxDerivationTypeForUsername };
  } else {
    const { username, derivationType } = await selectUsernameForAccount({
      rootNode,
      index,
      network,
    });
    return { username, stxDerivationType: derivationType };
  }
};
export const finishSignIn = async (
  { decodedAuthRequest, authRequest, appName, appIcon }: AuthRequestState,
  currentWallet: Wallet,
  accountIndex: number,
  network: Network,
  cb: Function,
) => {
  const rootNode = getRootNode(currentWallet);
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
  const { stxDerivationType } = await selectStxDerivation({
    index: accountIndex,
    network: network.stacksNetwork,
    username: account.username,
    rootNode,
  });
  const authResponse = await makeAuthResponse({
    gaiaHubUrl: gaiaUrl,
    appDomain: appURL.origin,
    transitPublicKey: decodedAuthRequest.public_keys[0],
    scopes: decodedAuthRequest.scopes,
    account:
      stxDerivationType === DerivationType.Wallet
        ? { ...account, dataPrivateKey: account.stxPrivateKey.slice(0, 64) }
        : account,
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
