import React, { useContext } from 'react';
import { TouchableOpacity, View, ScrollView, Text, Image } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

import { Typography } from '../../components/shared/Typography';
import RoundedImage from '../../components/shared/RoundedImage';

import Wise from '../../assets/wise.svg';
import PlaceholderImg from '../../assets/home-placeholder.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { AvailableNetworks } from '../../stores/NetworkStore/types';
import useNetwork from '../../hooks/useNetwork';
import { useLocalization } from '../../hooks/useLocalization';
import Header from '../../components/shared/Header';
import { ThemeContext } from '../../contexts/theme';
import { styles } from './styles';

const Home: React.FC = observer(() => {
  const { networkStore } = useStores();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { dispatch } = useNavigation();

  const goToSettings = () => dispatch(StackActions.push('Settings'));

  const containerStyle = [styles.container, { backgroundColor: colors.white }];

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Header
          leftComponent={<Wise />}
          rightComponent={
            <TouchableOpacity onPress={goToSettings}>
              <RoundedImage
                image={PlaceholderImg}
                diameter={40}
                hasAura={true}
              />
            </TouchableOpacity>
          }
        />

        {/* <Typography type="bigTitle">
        {networkStore.currentNetwork.name}
      </Typography>
      <ChangeNetworkButton /> */}
      </ScrollView>
    </SafeAreaView>
  );
});

// const ChangeNetworkButton: React.FC = observer(() => {
//   const { setActiveNetwork } = useNetwork();
//   const { translate } = useLocalization();
//   return (
//     <View>
//       <TouchableOpacity
//         onPress={() => setActiveNetwork(AvailableNetworks.TESTNET)}>
//         <Typography type="buttonText">
//           {translate('CHANGE_NETWORK_TESTNET_BUTTON')}
//         </Typography>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() => setActiveNetwork(AvailableNetworks.MAINNET)}>
//         <Typography type="buttonText">
//           {translate('CHANGE_NETWORK_MAINNET_BUTTON')}
//         </Typography>
//       </TouchableOpacity>
//     </View>
//   );
// });

export default Home;
