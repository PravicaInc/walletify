import { AvailableNetworks } from '../stores/NetworkStore/types';
import { useStores } from './useStores';

const useNetwork = () => {
  const { networkStore } = useStores();
  const {
    currentNetwork,
    currentNetworkInstance,
    setCurrentNetworkInstance,
    setCurrentNetwork,
  } = networkStore;

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
