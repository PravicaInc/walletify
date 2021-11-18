import { ChainID } from '@stacks/transactions';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
} from '../shared/constants';

export enum AvailableNetworks {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export interface Network {
  url: string;
  name: AvailableNetworks;
  chainId: ChainID;
}

export type Networks = Record<string, Network>;

export const defaultNetworks: Networks = {
  mainnet: {
    url: DEFAULT_MAINNET_SERVER,
    name: AvailableNetworks.MAINNET,
    chainId: ChainID.Mainnet,
  },
  testnet: {
    url: DEFAULT_TESTNET_SERVER,
    name: AvailableNetworks.TESTNET,
    chainId: ChainID.Testnet,
  },
} as const;
