import { AvailableNetworks } from '../stores/NetworkStore/types';
import { useStores } from './useStores';

const useNetwork = () => {
  const {
    networkStore: {
      currentNetwork,
      currentNetworkInstance,
      setCurrentNetworkInstance,
      setCurrentNetwork,
    },
  } = useStores();

  const setActiveNetwork = (network: AvailableNetworks) => {
    setCurrentNetwork(network);
    setCurrentNetworkInstance();
  };

  return {
    setActiveNetwork,
    currentNetwork,
    currentNetworkInstance,
  };
};

export default useNetwork;
