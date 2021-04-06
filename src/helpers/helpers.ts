import {
  ChainID,
  TransactionVersion,
  addressHashModeToVersion,
  addressFromVersionHash,
  addressToString,
  AddressHashMode,
  hashP2PKH,
  StacksMessageType,
} from '@stacks/transactions';
import {decryptContent, encryptMnemonic} from '@stacks/encryption';
import {ec} from 'elliptic';

import {BIP32Interface, fromSeed} from 'bip32';
import {mnemonicToSeed} from 'bip39';

import {bip32, ECPair} from 'bitcoinjs-lib';

import {makeReadOnlyGaiaConfig} from '../helpers/gaia';
import {GaiaHubConfig} from '@stacks/storage';
import Identity from '../helpers/identity';
import {
  ecPairToHexString,
  makeIdentity,
  recursiveRestoreIdentities,
} from '../helpers/utils';
import {Buffer} from 'buffer';
import {assertIsTruthy, WalletSigner} from '@stacks/keychain';

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
  try {
    const encryptedMnemonic = await encryptMnemonic(
      plaintextMnemonic,
      password,
    );
    const encryptedMnemonicHex = encryptedMnemonic.toString('hex');
    return {
      encryptedMnemonic,
      encryptedMnemonicHex,
    };
  } catch (error) {
    console.warn(error);
  }
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

export function getAddressFromPublicKey(
  /** Public key buffer or hex string */
  publicKey: string | Buffer,
  transactionVersion = TransactionVersion.Mainnet,
): string {
  publicKey =
    typeof publicKey === 'string' ? publicKey : publicKey.toString('hex');
  const addrVer = addressHashModeToVersion(
    AddressHashMode.SerializeP2PKH,
    transactionVersion,
  );
  const addr = addressFromVersionHash(
    addrVer,
    hashP2PKH(Buffer.from(publicKey, 'hex')),
  );
  const addrString = addressToString(addr);
  return addrString;
}

export function getAddressFromPrivateKey(
  /** Private key buffer or hex string */
  privateKey: string | Buffer,
  transactionVersion = TransactionVersion.Mainnet,
): string {
  const pubKey = pubKeyfromPrivKey(privateKey);
  return getAddressFromPublicKey(pubKey.data, transactionVersion);
}

export function getSigner(stacksPrivateKey: Buffer) {
  return new WalletSigner({privateKey: stacksPrivateKey});
}

function pubKeyfromPrivKey(privateKey: any) {
  var privKey = createStacksPrivateKey(privateKey);
  var ec$1 = new ec('secp256k1');
  var keyPair = ec$1.keyFromPrivate(
    privKey.data.toString('hex').slice(0, 64),
    'hex',
  );
  var pubKey = keyPair.getPublic(privKey.compressed, 'hex');
  return createStacksPublicKey(pubKey);
}

function createStacksPrivateKey(key: string) {
  var data = typeof key === 'string' ? Buffer.from(key, 'hex') : key;
  var compressed;
  if (data.length === 33) {
    if (data[data.length - 1] !== 1) {
      throw new Error(
        'Improperly formatted private-key. 33 byte length usually ' +
          'indicates compressed key, but last byte must be == 0x01',
      );
    }

    compressed = true;
  } else if (data.length === 32) {
    compressed = false;
  } else {
    throw new Error(
      'Improperly formatted private-key hex string: length should be 32 or 33 bytes, provided with length ' +
        data.length,
    );
  }
  return {data, compressed};
}
function createStacksPublicKey(key: string) {
  return {
    type: StacksMessageType.PublicKey,
    data: Buffer.from(key, 'hex'),
  };
}

function getSTXPrivateKey(privateKey: string) {
  const node = bip32.fromBase58(privateKey);
  assertIsTruthy<Buffer>(node.privateKey);
  return node.privateKey;
}

export function getSTXAddress(privateKey: any, version: TransactionVersion) {
  return getAddressFromPrivateKey(getSTXPrivateKey(privateKey), version);
}
