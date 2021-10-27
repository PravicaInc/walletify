import React, { useContext } from 'react';
import { TouchableOpacity, View, ScrollView, Text, Image } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

import { Typography } from '../../components/shared/Typography';
import RoundedImage from '../../components/shared/RoundedImage';
import SettingsIcon from '../../assets/settings.svg';

import Wise from '../../assets/wise.svg';
import PlaceholderImg from '../../assets/home-placeholder.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { AvailableNetworks } from '../../stores/NetworkStore/types';
import useNetwork from '../../hooks/useNetwork';
import { useLocalization } from '../../hooks/useLocalization';
import HomeNextLink from '../../components/HomeNextLink';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { ThemeContext } from '../../contexts/theme';
import { styles } from './styles';

const Settings: React.FC = observer(() => {
  const { networkStore } = useStores();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { dispatch } = useNavigation();

  const handleGoBack = () => dispatch(StackActions.pop());

  const containerStyle = [styles.container, { backgroundColor: colors.white }];

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <CustomAppHeader
          handleGoBack={handleGoBack}
          containerStyle={styles.header}
          backColor={colors.primary100}
          noBackText
          customBack={
            <Typography type="bigTitle" style={{ color: colors.primary100 }}>
              Settings
            </Typography>
          }
          customNext={
            <HomeNextLink text="Manage Accounts" icon={SettingsIcon} />
          }
        />
        <Typography type="bigTitle">Settings Screen</Typography>
        {/* <Typography type="bigTitle">
        {networkStore.currentNetwork.name}
      </Typography>
      <ChangeNetworkButton /> */}
      </ScrollView>
    </SafeAreaView>
  );
});

export default Settings;
