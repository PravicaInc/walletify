import { atom } from 'jotai';
import { ChainID, TransactionVersion } from '@stacks/transactions';
import {
  AvailableNetworks,
  defaultNetworks,
  Network,
  DEFAULT_NETWORK,
} from '../../models/network';

export const selectedNetworkKey = atom<AvailableNetworks>(DEFAULT_NETWORK);

export const selectedNetwork = atom<Network>(
  get => defaultNetworks[get(selectedNetworkKey)],
);

export const transactionNetworkVersionState = atom<TransactionVersion>(get =>
  get(selectedNetwork)?.chainId === ChainID.Mainnet
    ? TransactionVersion.Mainnet
    : TransactionVersion.Testnet,
);
