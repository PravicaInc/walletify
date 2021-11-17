import { StacksMainnet, StacksNetwork, StacksTestnet } from '@stacks/network';
import { ChainID } from '@stacks/transactions';
import { useCallback, useContext, useMemo } from 'react';
import {
  DEFAULT_MAINNET_SERVER,
  DEFAULT_TESTNET_SERVER,
} from '../shared/constants';
import { AvailableNetworks, defaultNetworks } from '../models/network';
import { UserPreferenceContext } from '../contexts/UserPreference/userPreferenceContext';

const useNetwork = () => {
  const {
    userPreference: { selectedNetworkKey },
    setSelectedNetworkKey,
  } = useContext(UserPreferenceContext);

  const selectedNetwork = useMemo(
    () => defaultNetworks[selectedNetworkKey],
    [selectedNetworkKey],
  );

  const activeStacksNetwork: StacksNetwork | undefined = useMemo(() => {
    if (selectedNetwork?.chainId === ChainID.Testnet) {
      const instanceWithBnsUrl = new StacksTestnet({
        url: DEFAULT_TESTNET_SERVER,
      });
      instanceWithBnsUrl.bnsLookupUrl = selectedNetwork.url;
      return instanceWithBnsUrl;
    } else if (selectedNetwork?.chainId === ChainID.Mainnet) {
      const instanceWithBnsUrl = new StacksMainnet({
        url: DEFAULT_MAINNET_SERVER,
      });
      instanceWithBnsUrl.bnsLookupUrl = selectedNetwork.url;
      return instanceWithBnsUrl;
    }
  }, [selectedNetwork]);

  const setActiveNetwork = useCallback((network: AvailableNetworks) => {
    setSelectedNetworkKey(network);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    activeStacksNetwork,
    selectedNetwork,
    setActiveNetwork,
  };
};

export default useNetwork;
