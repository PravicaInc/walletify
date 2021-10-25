import NetworkStore from '../NetworkStore';
import { create } from 'mobx-persist';
import AsyncStorage from '@react-native-community/async-storage';

const hydrate = create({
  storage: AsyncStorage,
  jsonify: true,
});

export class RootStore {
  networkStore: NetworkStore;
  isStoresHydrated = false;

  constructor() {
    this.networkStore = new NetworkStore(this);
    Promise.all([
      hydrate('networks', this.networkStore).then(() =>
        this.networkStore.initializeStore(),
      ),
    ]).then(() => (this.isStoresHydrated = true));
  }
}

export default new RootStore();
