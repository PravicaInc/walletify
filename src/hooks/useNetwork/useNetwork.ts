import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { ChainID } from '@stacks/transactions';
import { useMemo } from 'react';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
} from '../../shared/constants';
import { useAtom } from 'jotai';
import { selectedNetworkKey, selectedNetwork } from './networkStore';
import { useAtomValue } from 'jotai/utils';

const useNetwork = () => {
  const [currentNetworkKey, setCurrentNetworkKey] = useAtom(selectedNetworkKey);
  const currentNetwork = useAtomValue(selectedNetwork);

  const currentNetworkInstance: StacksNetwork | undefined = useMemo(() => {
    if (currentNetwork?.chainId === ChainID.Testnet) {
      const instanceWithBnsUrl = new StacksTestnet({
        url: DEFAULT_TESTNET_SERVER,
      });
      instanceWithBnsUrl.bnsLookupUrl = currentNetwork.url;
      return instanceWithBnsUrl;
    } else if (currentNetwork?.chainId === ChainID.Mainnet) {
      const instanceWithBnsUrl = new StacksMainnet({
        url: DEFAULT_MAINNET_SERVER,
      });
      instanceWithBnsUrl.bnsLookupUrl = currentNetwork.url;
      return instanceWithBnsUrl;
    }
  }, [currentNetwork]);

  return {
    currentNetworkKey,
    setCurrentNetworkKey,
    currentNetworkInstance,
    currentNetwork,
  };
};

export default useNetwork;
