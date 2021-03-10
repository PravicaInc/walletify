import {ThunkAction} from 'redux-thunk';
import {
  deriveRootKeychainFromMnemonic,
  deriveStxAddressChain,
  getBlockchainIdentities,
  Wallet,
} from '@stacks/keychain';
import {
  WalletActions,
  RESTORE_WALLET,
  IS_RESTORING_WALLET,
  GENERATE_WALLET,
  SIGN_OUT,
} from './types';
import {ChainID} from '@blockstack/stacks-transactions';
// import {
//   deriveRootKeychainFromMnemonic,
//   deriveStxAddressChain,
//   // encryptMnemonicFormatted,
// } from '../../helpers/helpers';
import {DEFAULT_GAIA_HUB} from '../../helpers/gaia';
import {BIP32Interface} from 'bip32';
// import {getBlockchainIdentities} from '../../helpers/utils';

export function didRestoreWallet(wallet: Wallet): WalletActions {
  return {
    type: RESTORE_WALLET,
    payload: wallet,
  };
}

export function didGenerateWallet(wallet: Wallet): WalletActions {
  return {
    type: GENERATE_WALLET,
    payload: wallet,
  };
}

function isRestoringWallet(): WalletActions {
  return {
    type: IS_RESTORING_WALLET,
  };
}

export function doSignOut(): WalletActions {
  return {
    type: SIGN_OUT,
  };
}

export function doStoreSeed(
  secretKey: string,
  password: string,
): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async (dispatch) => {
    dispatch(isRestoringWallet());
    const wallet = await restore(password, secretKey, ChainID.Mainnet);
    console.warn('WALLET YASTA', wallet);
    dispatch(didRestoreWallet(wallet));
    return wallet;
  };
}

export function doGenerateWallet(
  password: string,
): ThunkAction<Promise<Wallet>, {}, {}, WalletActions> {
  return async (dispatch) => {
    dispatch(isRestoringWallet());
    const wallet = await Wallet.generate(password, ChainID.Mainnet);
    dispatch(didGenerateWallet(wallet));
    return wallet;
  };
}

const restore = async (
  password: string,
  seedPhrase: string,
  chain: ChainID,
) => {
  const rootNode = await deriveRootKeychainFromMnemonic(seedPhrase);
  // const {encryptedMnemonicHex} = await encryptMnemonicFormatted(
  //   seedPhrase,
  //   password,
  // );

  const wallet = await createAccount({
    encryptedBackupPhrase: '',
    rootNode,
    chain,
  });

  return await wallet.restoreIdentities({
    rootNode,
    gaiaReadURL: DEFAULT_GAIA_HUB,
  });
};

const createAccount = async ({
  encryptedBackupPhrase,
  rootNode,
  chain,
  identitiesToGenerate = 1,
}: {
  encryptedBackupPhrase: string;
  rootNode: BIP32Interface;
  chain: ChainID;
  identitiesToGenerate?: number;
}) => {
  const derivedIdentitiesKey = rootNode.deriveHardened(45).privateKey;
  if (!derivedIdentitiesKey) {
    throw new TypeError('Unable to derive config key for wallet identities');
  }
  const configPrivateKey = derivedIdentitiesKey.toString('hex');
  const {childKey: stxAddressKeychain} = deriveStxAddressChain(chain)(rootNode);
  const walletAttrs = await getBlockchainIdentities(
    rootNode,
    10,
  );

  return new Wallet({
    ...walletAttrs,
    chain,
    configPrivateKey,
    stacksPrivateKey: stxAddressKeychain.toBase58(),
    encryptedBackupPhrase,
  });
};
