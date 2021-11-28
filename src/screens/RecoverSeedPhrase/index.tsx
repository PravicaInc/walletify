import React, { useContext, useRef, useCallback } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { decryptMnemonic } from '@stacks/encryption';
import { UserCredentials } from 'react-native-keychain';
import GeneralButton from '../../components/shared/GeneralButton';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import EnterPasswordModal from '../../components/EnterPasswordModal';
import { Typography } from '../../components/shared/Typography';
import SecureKeychain from '../../shared/SecureKeychain';

import { ThemeContext } from '../../contexts/Theme/theme';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';

const RecoverSeedPhrase: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const { dispatch } = useNavigation();

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const {
    userPreference: { encryptedSeedPhrase, hasSetBiometric },
  } = useContext(UserPreferenceContext);

  const handlePresentEnterPassword = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handlePasswordModalAction = ({
    seedPhrase,
  }: {
    seedPhrase: string;
  }) => {
    bottomSheetModalRef.current?.dismiss();
    dispatch(StackActions.replace('ShowSeedPhrase', { seedPhrase }));
  };

  const handleGetBiometricData = async () => {
    const userCredentials = await SecureKeychain.getGenericPassword();
    const seedDecrypted = await decryptMnemonic(
      encryptedSeedPhrase,
      (userCredentials as UserCredentials).password,
    );
    dispatch(
      StackActions.replace('ShowSeedPhrase', { seedPhrase: seedDecrypted }),
    );
  };

  const handleGoBack = () => dispatch(StackActions.replace('Settings'));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <EnterPasswordModal
        ref={bottomSheetModalRef}
        handleNextAction={handlePasswordModalAction}
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
              onPress={
                hasSetBiometric
                  ? handleGetBiometricData
                  : handlePresentEnterPassword
              }
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
