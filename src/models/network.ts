import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { ChainID } from '@stacks/transactions';

export enum AvailableNetworks {
  MAINNET = 'mainnet',
  TESTNET = 'testnet',
}

export const DEFAULT_NETWORK = AvailableNetworks.MAINNET;

export const DEFAULT_TESTNET_SERVER =
  'https://stacks-node-api.testnet.stacks.co';

export const DEFAULT_MAINNET_SERVER = 'https://stacks-node-api.stacks.co';

export interface Network {
  url: string;
  name: AvailableNetworks;
  chainId: ChainID;
  stacksNetwork: StacksNetwork;
}

export type Networks = Record<string, Network>;

export const defaultNetworks: Networks = {
  mainnet: {
    url: DEFAULT_MAINNET_SERVER,
    name: AvailableNetworks.MAINNET,
    chainId: ChainID.Mainnet,
    stacksNetwork: new StacksMainnet({ url: DEFAULT_MAINNET_SERVER }),
  },
  testnet: {
    url: DEFAULT_TESTNET_SERVER,
    name: AvailableNetworks.TESTNET,
    chainId: ChainID.Testnet,
    stacksNetwork: new StacksTestnet({ url: DEFAULT_TESTNET_SERVER }),
  },
} as const;
