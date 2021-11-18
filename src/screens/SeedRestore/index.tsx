import React, { useContext, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import GeneralButton from '../../components/shared/GeneralButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';

import { ThemeContext } from '../../contexts/Theme/theme';
import LockedShield from '../../assets/locked-shield.svg';

import { RootStackParamList } from '../../navigation/types';
import styles from './styles';
import { useWallet } from '../../hooks/useWallet/useWallet';

type Props = NativeStackScreenProps<RootStackParamList, 'SeedGeneration'>;

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

  const containerStyle = [styles.container, { backgroundColor: colors.white }];

  const inputStyle = [styles.seedInput, { backgroundColor: colors.card }];

  return (
    <SafeAreaView style={containerStyle}>
      <CustomAppHeader
        noBackText={false}
        handleGoBack={handleGoBack}
        containerStyle={styles.header}
        backColor={colors.primary100}
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
                customStyle={inputStyle}
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
    </SafeAreaView>
  );
};

export default SeedRestore;
