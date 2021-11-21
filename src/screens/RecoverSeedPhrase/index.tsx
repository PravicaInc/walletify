import React, { useContext, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import GeneralButton from '../../components/shared/GeneralButton';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import EnterPasswordModal from '../../components/EnterPasswordModal';
import { Typography } from '../../components/shared/Typography';

import { ThemeContext } from '../../contexts/Theme/theme';
import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';

const RecoverSeedPhrase: React.FC = () => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [enterPasswordVisible, setEnterPasswordVisible] = useState(false);

  const toggleEnterPassword = () =>
    setEnterPasswordVisible(!enterPasswordVisible);

  const handleNextAction = ({ seedPhrase }: { seedPhrase: string }) =>
    dispatch(StackActions.replace('ShowSeedPhrase', { seedPhrase }));

  const handleGoBack = () => dispatch(StackActions.replace('Settings'));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <EnterPasswordModal
        handleNextAction={handleNextAction}
        toggleEnterPassword={toggleEnterPassword}
        enterPasswordVisible={enterPasswordVisible}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentContainer}>
          <Header
            leftComponent={
              <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
            }
          />
          <View style={styles.topContent}>
            <LockedShield />
            <Typography type="bigTitle" style={styles.title}>
              Recover Your Seed Phrase
            </Typography>
            <Typography
              type="commonText"
              style={[styles.description, { color: colors.primary60 }]}>
              This feature allows you to recover your seed phrase in case you
              need it.
            </Typography>
          </View>

          <View style={styles.bottomContent}>
            <GeneralButton
              type={'activePrimary'}
              onPress={toggleEnterPassword}
              style={styles.actionButtonTop}>
              View Seed Phrase
            </GeneralButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default RecoverSeedPhrase;
