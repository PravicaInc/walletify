import React, { useCallback, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import Logo from '../../assets/wise.svg';
import LockAndStacks from '../../assets/lock-and-stacks.svg';
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.contentContainer}>
        <Logo style={styles.logo} />
        <LockAndStacks />
        <Typography type={'bigTitle'} style={styles.title}>
          Seamless user experience, and Decentralized authentication
        </Typography>
        <TouchableOpacity
          onPress={handleCreate}
          style={[
            styles.button,
            {
              backgroundColor: colors.primary100,
            },
          ]}>
          <Typography type="buttonText" style={{ color: colors.white }}>
            Create Wallet
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRestore}
          style={[
            styles.button,
            styles.buttonBorder,
            {
              backgroundColor: colors.white,
              borderColor: colors.primary100,
            },
          ]}>
          <Typography type="buttonText" style={{ color: colors.primary100 }}>
            Restore Wallet
          </Typography>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default WalletSetup;
