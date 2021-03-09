import {ChainID} from '@stacks/transactions';
import {DEFAULT_GAIA_HUB} from '../helpers/gaia';
import {
  deriveRootKeychainFromMnemonic,
  encryptMnemonicFormatted,
  deriveStxAddressChain,
  restoreIdentities,
} from '../helpers/helpers';
import {getBlockchainIdentities} from '../helpers/utils';

export const useWallet = () => {
  const restore = async (
    password: string,
    seedPhrase: string,
    chain: ChainID,
    fetchRemoteUsernames: boolean,
  ) => {
    const rootNode = await deriveRootKeychainFromMnemonic(seedPhrase);
    const {encryptedMnemonicHex} = await encryptMnemonicFormatted(
      seedPhrase,
      password,
    );
    const encryptedBackupPhrase = encryptedMnemonicHex;

    const derivedIdentitiesKey = rootNode.deriveHardened(45).privateKey;
    if (!derivedIdentitiesKey) {
      throw new TypeError('Unable to derive config key for wallet identities');
    }
    const configPrivateKey = derivedIdentitiesKey.toString('hex');
    const {childKey: stxAddressKeychain} = deriveStxAddressChain(
      chain,
      rootNode,
    );
    const walletAttrs = await getBlockchainIdentities(rootNode, 1);
    const lastOne = await restoreIdentities({
      rootNode,
      gaiaReadURL: DEFAULT_GAIA_HUB,
      configPrivateKey,
      identities: walletAttrs.identities,
      fetchRemoteUsernames,
    });
    console.warn(
      {
        ...walletAttrs,
        chain,
        configPrivateKey,
        stacksPrivateKey: stxAddressKeychain.toBase58(),
        encryptedBackupPhrase,
      },
      lastOne,
    );
  };

  return {
    restore,
  };
};
