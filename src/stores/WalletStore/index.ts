import { RootStore } from '../RootStore';
import { makeAutoObservable } from 'mobx';
import {
  createWalletGaiaConfig,
  fetchWalletConfig,
  generateWallet,
  Wallet,
  WalletConfig,
  restoreWalletAccounts,
} from '@stacks/wallet-sdk/dist';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-community/async-storage';
import { gaiaUrl } from '../../shared/constants';

export class WalletStore {
  rootStore: RootStore;
  wallet: Wallet;
  walletConfig: WalletConfig | null;
  encryptedSeedPhrase: string = '';

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    makePersistable(this, {
      name: 'wallet',
      properties: ['encryptedSeedPhrase'],
      storage: AsyncStorage,
    });
  }

  setWalletConfig = async () => {
    const gaiaHubConfig = await createWalletGaiaConfig({
      gaiaHubUrl: gaiaUrl,
      wallet: this.wallet,
    });
    this.walletConfig = await fetchWalletConfig({
      wallet: this.wallet,
      gaiaHubConfig,
    });
  };

  createWallet = async (secretKey: string, password: string) => {
    const generatedWallet = await generateWallet({
      secretKey,
      password,
    });
    this.encryptedSeedPhrase = generatedWallet.encryptedSecretKey;
    this.wallet = generatedWallet;
  };

  restoreWallet = async (secretKey: string, password: string) => {
    const generatedWallet = await generateWallet({
      secretKey,
      password,
    });
    this.encryptedSeedPhrase = generatedWallet.encryptedSecretKey;
    this.wallet = await restoreWalletAccounts({
      wallet: generatedWallet,
      gaiaHubUrl: gaiaUrl,
    });
  };
}
