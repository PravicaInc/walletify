import {
  getAddressFromPrivateKey,
  ChainID,
  TransactionVersion,
} from '@stacks/transactions';
import {decryptContent, encryptMnemonic} from '@stacks/encryption';

import {BIP32Interface, fromSeed} from 'bip32';
import {mnemonicToSeed} from 'bip39';

import {ECPair} from 'bitcoinjs-lib';

import {makeReadOnlyGaiaConfig} from '../helpers/gaia';
import {GaiaHubConfig} from '@stacks/storage';
import Identity from '../helpers/identity';
import {
  ecPairToHexString,
  makeIdentity,
  recursiveRestoreIdentities,
} from '../helpers/utils';

const networkDerivationPath = "m/44'/5757'/0'/0/0";

export const derivationPaths = {
  [ChainID.Mainnet]: networkDerivationPath,
  [ChainID.Testnet]: networkDerivationPath,
};
export interface ConfigIdentity {
  username?: string;
  address: string;
  apps: {
    [origin: string]: ConfigApp;
  };
}

export interface ConfigApp {
  origin: string;
  scopes: string[];
  lastLoginAt: number;
  appIcon: string;
  name: string;
}

export interface WalletConfig {
  identities: ConfigIdentity[];
  hideWarningForReusingIdentity?: boolean;
}

export const deriveRootKeychainFromMnemonic = async (
  plaintextMnemonic: string,
) => {
  const seedBuffer = await mnemonicToSeed(plaintextMnemonic);
  const rootNode = fromSeed(seedBuffer);
  return rootNode;
};

export const encryptMnemonicFormatted = async (
  plaintextMnemonic: string,
  password: string,
) => {
  const encryptedMnemonic = await encryptMnemonic(plaintextMnemonic, password);
  const encryptedMnemonicHex = encryptedMnemonic.toString('hex');
  return {
    encryptedMnemonic,
    encryptedMnemonicHex,
  };
};

export const getDerivationPath = (chain: ChainID) => derivationPaths[chain];

export const deriveStxAddressChain = (chain: any, rootNode: BIP32Interface) => {
  const childKey = rootNode.derivePath(getDerivationPath(chain));
  if (!childKey.privateKey) {
    throw new Error(
      'Unable to derive private key from `rootNode`, bip32 master keychain',
    );
  }
  const ecPair = ECPair.fromPrivateKey(childKey.privateKey);
  const privateKey = ecPairToHexString(ecPair);
  const txVersion =
    chain === ChainID.Mainnet
      ? TransactionVersion.Mainnet
      : TransactionVersion.Testnet;
  return {
    childKey,
    address: getAddressFromPrivateKey(privateKey, txVersion),
    privateKey,
  };
};

export const fetchConfig = async (
  gaiaConfig: GaiaHubConfig,
  configPrivateKey: any,
): Promise<WalletConfig | null> => {
  try {
    const response = await fetch(
      `${gaiaConfig.url_prefix}${gaiaConfig.address}/wallet-config.json`,
    );
    const encrypted = await response.text();
    const configJSON = (await decryptContent(encrypted, {
      privateKey: configPrivateKey,
    })) as string;
    const config: WalletConfig = JSON.parse(configJSON);
    return config;
  } catch (error) {
    return null;
  }
};

export const restoreIdentities = async ({
  rootNode,
  gaiaReadURL,
  configPrivateKey,
  identities,
  fetchRemoteUsernames,
}: {
  rootNode: BIP32Interface;
  gaiaReadURL: string;
  configPrivateKey: any;
  identities: any;
  fetchRemoteUsernames: boolean;
}) => {
  let newIdentities = [];
  const gaiaConfig = makeReadOnlyGaiaConfig({
    readURL: gaiaReadURL,
    privateKey: configPrivateKey,
  });
  const config = await fetchConfig(gaiaConfig, configPrivateKey);
  if (config) {
    const getIdentities = config.identities.map(
      async (identityConfig: any, index: number) => {
        let identity: Identity | null = identities[index];
        if (!identity) {
          identity = await makeIdentity(rootNode, index);
        }
        if (identityConfig.username) {
          identity.usernames = [identityConfig.username];
          identity.defaultUsername = identityConfig.username;
        }
        return identity;
      },
    );
    newIdentities = await Promise.all(getIdentities);
  }
  await identities[0].refresh(gaiaReadURL);
  const currentNewIdentities = await recursiveRestoreIdentities({
    rootNode,
    index: 1,
    identities: [],
    fetchRemoteUsernames,
  });
  newIdentities = identities.concat(currentNewIdentities);
  return newIdentities;
};
