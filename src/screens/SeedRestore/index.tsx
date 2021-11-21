import React, { useContext, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import GeneralButton from '../../components/shared/GeneralButton';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';

import { ThemeContext } from '../../contexts/Theme/theme';
import LockedShield from '../../assets/locked-shield.svg';

import { RootStackParamList } from '../../navigation/types';
import styles from './styles';
import { useWallet } from '../../hooks/useWallet/useWallet';

type Props = NativeStackScreenProps<RootStackParamList, 'SeedRestore'>;

const SeedRestore: React.FC<Props> = props => {
  const { dispatch } = useNavigation();
  const password = props.route.params?.password;

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [seedPhrase, setSeedPhrase] = useState('');

  const handleContinue = async () => {
    dispatch(
      StackActions.replace('Home', {
        password,
        seedPhrase,
      }),
    );
  };

  const handleOldPassword = () =>
    dispatch(StackActions.push('OldPassword', { seedPhrase }));

  const handleGoBack = () => dispatch(StackActions.pop());

  let BottomButton = (
    <GeneralButton type="inactivePrimary">Continue</GeneralButton>
  );

  if (seedPhrase.length > 0) {
    BottomButton = (
      <GeneralButton
        style={styles.button}
        type="activePrimary"
        onPress={
          seedPhrase === 'old seed phrase' ? handleOldPassword : handleContinue
        }>
        Continue
      </GeneralButton>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.container}>
        <Header
          leftComponent={
            <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
          }
        />

        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}>
          <ScrollView contentContainerStyle={styles.scrollableContent}>
            <View style={styles.topContent}>
              <LockedShield />
              <Typography type="bigTitle" style={styles.title}>
                Enter Your Seed Phrase
              </Typography>
              <Typography type="commonText" style={styles.description}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industryLorem Ipsum has beenLorem
              </Typography>
            </View>

            <View style={styles.bottomContent}>
              <Typography type="commonTextBold" style={styles.seedTitle}>
                Your Seed Phrase:
              </Typography>
              <View style={styles.seedInputContainer}>
                <GeneralTextInput
                  value={seedPhrase}
                  customStyle={[
                    styles.seedInput,
                    { backgroundColor: colors.card },
                  ]}
                  onChangeText={setSeedPhrase}
                  disableCancel
                  multiline={true}
                  placeholder="Type Your Seed Phrase..."
                  placeholderTextColor={colors.primary20}
                  secureTextEntry={false}
                />
              </View>
            </View>

            {BottomButton}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default SeedRestore;
