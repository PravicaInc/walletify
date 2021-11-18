import NetworkStore from '../NetworkStore';
import { LocalizationStore } from '../LocalizationStore';
import UIStore from '../UIStore';
import { WalletStore } from "../WalletStore";

export class RootStore {
  isStoresHydrated = false;
  networkStore: NetworkStore;
  localizationStore: LocalizationStore;
  uiStore: UIStore;
  walletStore: WalletStore;
  constructor() {
    this.networkStore = new NetworkStore(this);
    this.localizationStore = new LocalizationStore(this);
    this.uiStore = new UIStore(this);
    this.walletStore = new WalletStore(this);
  }
}

export default new RootStore();