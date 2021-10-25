import NetworkStore from '../NetworkStore';
import { create } from 'mobx-persist';
import AsyncStorage from '@react-native-community/async-storage';
import { LocalizationStore } from '../localization';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

export class RootStore {
  isStoresHydrated = false;
  networkStore: NetworkStore;
  localizationStore: LocalizationStore;

  hydrateStores = async () => {
    return Promise.all([
      hydrate('networks', this.networkStore).then(() =>
        this.networkStore.initializeStore(),
      ),
      hydrate('localization', this.localizationStore),
    ]).then(() => (this.isStoresHydrated = true));
  };

  constructor() {
    this.networkStore = new NetworkStore(this);
    this.localizationStore = new LocalizationStore(this);
    Promise.all([
      hydrate('networks', this.networkStore).then(() =>
        this.networkStore.initializeStore(),
      ),
      hydrate('localization', this.localizationStore),
    ]).then(() => (this.isStoresHydrated = true));
  }
}

export default new RootStore();
