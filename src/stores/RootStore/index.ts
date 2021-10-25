import NetworkStore from '../NetworkStore';
import { LocalizationStore } from '../LocalizationStore';
import UIStore from '../UIStore';

export class RootStore {
  isStoresHydrated = false;
  networkStore: NetworkStore;
  localizationStore: LocalizationStore;
  uiStore: UIStore;
  constructor() {
    this.networkStore = new NetworkStore(this);
    this.localizationStore = new LocalizationStore(this);
    this.uiStore = new UIStore(this);
  }
}

export default new RootStore();
