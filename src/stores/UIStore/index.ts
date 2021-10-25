import { makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-community/async-storage';

class UIStore {
  rootStore: RootStore;
  hasSeenOnBoarding = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    makePersistable(this, {
      name: 'ui',
      properties: ['hasSeenOnBoarding'],
      storage: AsyncStorage,
    });
  }
}

export default UIStore;
