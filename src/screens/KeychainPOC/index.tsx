import React, { useContext, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CustomButton from '../../components/shared/CustomButton';
import { MyText } from '../../components/shared/myText';
import { MyTextInput } from '../../components/shared/MyTextInput';
import { ThemeContext } from '../../contexts/theme';
import styles from './styles';

import SecureKeychain from '../../core/SecureKeychain';
import { decrypt, encrypt } from '@stacks/keychain';
import {
  EXISTING_USER,
  NEXT_MAKER_REMINDER,
  TRUE,
  SEED_PHRASE_HINTS,
  BIOMETRY_CHOICE_DISABLED,
} from '../../constants/storage';

import seedPhrase from '../../data/seedPhrase';
import AsyncStorage from '@react-native-community/async-storage';

const EnterPassword: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [password, setPassword] = useState<string>('');

  const [biometryChoice, setBiometryChoice] = useState(false);

  const [revealedPassword, setRevealedPassword] = useState<string | undefined>(
    undefined,
  );
  const [revealedPhrase, setRevealedPhrase] = useState<string | undefined>(
    undefined,
  );

  const handlePressCreate = async () => {
    try {
      if (biometryChoice) {
        await SecureKeychain.setGenericPassword(
          password,
          SecureKeychain.TYPES.BIOMETRICS,
        );
      } else {
        await SecureKeychain.setGenericPassword(
          password,
          SecureKeychain.TYPES.REMEMBER_ME,
        );
      }

      const mnemonicSeedPhrase = seedPhrase.split(' ').slice(0, 12).join(' ');

      const encryptedSeed = await encrypt(mnemonicSeedPhrase, password);

      await AsyncStorage.setItem(
        SEED_PHRASE_HINTS,
        JSON.stringify(encryptedSeed),
      );

      setPassword('');
      setRevealedPassword(undefined);
      setRevealedPhrase(undefined);
    } catch (e) {
      console.warn(e);
    }
  };

  const handlePressReveal = async () => {
    try {
      const passwordObject = await SecureKeychain.getGenericPassword();

      const pwd = passwordObject.password;

      const encryptedSeedPhrase = await AsyncStorage.getItem(SEED_PHRASE_HINTS);
      const decryptedSeedPhrase = await decrypt(
        JSON.parse(encryptedSeedPhrase),
        pwd,
      );
      setRevealedPassword(pwd);
      setRevealedPhrase(decryptedSeedPhrase);
    } catch (e) {
      console.warn(e);
    }
  };

  const handleToggleBiometry = async biometryChoice => {
    if (!biometryChoice) {
      await AsyncStorage.setItem(BIOMETRY_CHOICE_DISABLED, TRUE);
    } else {
      await AsyncStorage.removeItem(BIOMETRY_CHOICE_DISABLED);
    }
    setBiometryChoice(biometryChoice);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <KeyboardAvoidingView
        contentContainerStyle={styles.contentContainer}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={0}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <MyTextInput
          customStyle={styles.input}
          labelText="Enter a Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          disableCancel
        />
        <View style={{ flexDirection: 'row' }}>
          <MyText type="commonTextBold">Toggle Biometrics:</MyText>
          <View>
            <Switch
              onValueChange={handleToggleBiometry} // eslint-disable-line react/jsx-no-bind
              value={biometryChoice}
            />
          </View>
        </View>
        <CustomButton
          style={styles.button}
          type="activePrimary"
          onPress={handlePressCreate}>
          Create / Replace
        </CustomButton>
        <CustomButton
          style={styles.button}
          type="activeSecondary"
          onPress={handlePressReveal}>
          Reveal Password
        </CustomButton>
        <View>
          {revealedPassword !== undefined && (
            <View style={{ marginTop: 30 }}>
              <MyText type="commonTextBold">{`Your Password is: `}</MyText>
              <MyText type="commonText">{revealedPassword}</MyText>
            </View>
          )}
          {revealedPhrase !== undefined && (
            <View style={{ marginTop: 30 }}>
              <MyText type="commonTextBold">{`Your seed phrase is: `}</MyText>
              <MyText type="commonText">{revealedPhrase}</MyText>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EnterPassword;
