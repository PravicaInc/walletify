import React, { useCallback, useContext } from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import Logo from '../../assets/walletifyText.svg';
const WiseStacks = require('../../assets/images/walletSetup/walletCreate.png');
import { Typography } from '../../components/shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';

const WalletSetup: React.FC = () => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const handleCreate = useCallback(
    () =>
      dispatch(
        StackActions.push('CreatePassword', {
          nextScreen: 'CreateSeedPhrase',
        }),
      ),
    [],
  );

  const handleRestore = useCallback(
    () =>
      dispatch(
        StackActions.push('CreatePassword', {
          nextScreen: 'SeedRestore',
        }),
      ),
    [],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.defaultBlack }]}>
      <View style={styles.contentContainer}>
        <Logo />
        <View style={styles.stacksIllustrationContainer}>
          <Image source={WiseStacks} style={styles.stacksIllustration} />
        </View>
        <Typography type={'bigTitle'} style={styles.title}>
          Seamless user experience, and Decentralized authentication
        </Typography>
        <TouchableOpacity
          onPress={handleCreate}
          style={[
            styles.button,
            {
              backgroundColor: colors.activeState,
            },
          ]}>
          <Typography type="buttonText" style={{ color: colors.primary100 }}>
            Create Wallet
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRestore}
          style={[
            styles.button,
            styles.buttonBorder,
            {
              backgroundColor: colors.defaultBlack,
              borderColor: colors.activeState,
            },
          ]}>
          <Typography type="buttonText" style={{ color: 'white' }}>
            Restore Wallet
          </Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WalletSetup;
