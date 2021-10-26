import { RootStore } from "../RootStore";
import { makeAutoObservable } from "mobx";
import {
  createWalletGaiaConfig,
  fetchWalletConfig,
  generateSecretKey,
  generateWallet,
  Wallet,
  WalletConfig
} from "@stacks/wallet-sdk/dist";
import { gaiaUrl, WALLET_DEFAULT_PASSWORD } from "../../shared/constants";

export class WalletStore {
  rootStore: RootStore;
  wallet: Wallet;
  walletConfig: WalletConfig | null;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
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
    this.wallet = await generateWallet({
      secretKey,
      password,
    });
  };
}
