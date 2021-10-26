import { makeAutoObservable } from 'mobx';
import { RootStore } from '../RootStore';
import { makePersistable, isHydrated } from 'mobx-persist-store';
import AsyncStorage from '@react-native-community/async-storage';

class UIStore {
  rootStore: RootStore;
  hasSeenOnBoarding = false;
  isBiometryEnabled = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    makePersistable(this, {
      name: 'ui',
      properties: ['hasSeenOnBoarding', 'isBiometryEnabled'],
      storage: AsyncStorage,
    });
  }

  setHasSeenOnBoarding = (value: boolean) => {
    this.hasSeenOnBoarding = value;
  };

  setIsBiometryEnabled = (value: boolean) => {
    this.isBiometryEnabled = value;
  };

  get isHydrated() {
    return isHydrated(this);
  }
}

export default UIStore;
