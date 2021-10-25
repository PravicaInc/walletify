import { makeAutoObservable } from 'mobx';
import { StacksTestnet, StacksMainnet, StacksNetwork } from '@stacks/network';
import { ChainID } from '@stacks/transactions';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_NETWORK,
  DEFAULT_TESTNET_SERVER,
} from '../../shared/constants';
import { RootStore } from '../RootStore';
import { defaultNetworks, Networks, Network, AvailableNetworks } from './types';
import { makePersistable } from 'mobx-persist-store';
import AsyncStorage from '@react-native-community/async-storage';

class NetworkStore {
  rootStore: RootStore;
  networks: Networks = defaultNetworks;
  currentNetwork: Network = defaultNetworks[AvailableNetworks.MAINNET];
  currentNetworkInstance: StacksNetwork;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    makePersistable(this, {
      name: 'networkStore',
      properties: ['currentNetwork'],
      storage: AsyncStorage,
    });
  }

  setCurrentNetwork = (network: AvailableNetworks) => {
    this.currentNetwork = this.networks[network];
  };

  setCurrentNetworkInstance = () => {
    const stacksNetwork =
      this.currentNetwork.chainId === ChainID.Testnet
        ? new StacksTestnet({ url: DEFAULT_TESTNET_SERVER })
        : new StacksMainnet({ url: DEFAULT_MAINNET_SERVER });
    stacksNetwork.bnsLookupUrl = this.currentNetwork.url;
    this.currentNetworkInstance = stacksNetwork;
  };

  initializeStore = () => {
    if (this.currentNetwork) {
      this.setCurrentNetworkInstance();
    } else {
      this.currentNetwork = defaultNetworks[DEFAULT_NETWORK];
      this.setCurrentNetworkInstance();
    }
  };
}

export default NetworkStore;
