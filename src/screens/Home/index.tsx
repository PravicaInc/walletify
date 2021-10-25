import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { Typography } from '../../components/shared/Typography';
import Wise from '../../assets/wise.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { AvailableNetworks } from '../../stores/NetworkStore/types';
import useNetwork from '../../hooks/useNetwork';
import { useLocalization } from '../../hooks/useLocalization';

const Home: React.FC = observer(() => {
  const { networkStore } = useStores();
  return (
    <SafeAreaView style={styles.container}>
      <Wise />
      <Typography type="bigTitle">
        {networkStore.currentNetwork.name}
      </Typography>
      <ChangeNetworkButton />
    </SafeAreaView>
  );
});

const ChangeNetworkButton: React.FC = observer(() => {
  const { setActiveNetwork } = useNetwork();
  const { translate } = useLocalization();
  return (
    <View>
      <TouchableOpacity
        onPress={() => setActiveNetwork(AvailableNetworks.TESTNET)}>
        <Typography type="buttonText">
          {translate('CHANGE_NETWORK_TESTNET_BUTTON')}
        </Typography>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setActiveNetwork(AvailableNetworks.MAINNET)}>
        <Typography type="buttonText">
          {translate('CHANGE_NETWORK_MAINNET_BUTTON')}
        </Typography>
      </TouchableOpacity>
    </View>
  );
});

export default Home;
