import React, { useContext, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Keychain from 'react-native-keychain';

import GeneralButton from '../../components/shared/GeneralButton';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/theme';
import styles from './styles';

import SecureKeychain from '../../shared/SecureKeychain';
import { decrypt, encrypt } from '@stacks/keychain';


// import seedPhrase from '../../data/seedPhrase';
import AsyncStorage from '@react-native-community/async-storage';
import { trackDerivedFunction } from "mobx/dist/core/derivation";

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
          Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE
        );
      } else {
        await SecureKeychain.setGenericPassword(password,undefined);
      }
const seedPhrase = "ostrich cage heavy assist develop property cactus fish bounce badge health laptop"
      const mnemonicSeedPhrase = seedPhrase.split(' ').slice(0, 12).join(' ');

      const encryptedSeed = await encrypt(mnemonicSeedPhrase, password);

      await AsyncStorage.setItem(
        "SEED_PHRASE_HINTS",
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

const pwd=passwordObject.password;

      const encryptedSeedPhrase = await AsyncStorage.getItem("SEED_PHRASE_HINTS");
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
      await AsyncStorage.setItem("BIOMETRY_CHOICE_DISABLED", true);
    } else {
      await AsyncStorage.removeItem("BIOMETRY_CHOICE_DISABLED");
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
        <GeneralTextInput
          customStyle={styles.input}
          labelText="Enter a Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          disableCancel
        />
        <View style={{ flexDirection: 'row' }}>
          <Typography type="commonTextBold">Toggle Biometrics:</Typography>
          <View>
            <Switch
              onValueChange={handleToggleBiometry} // eslint-disable-line react/jsx-no-bind
              value={biometryChoice}
            />
          </View>
        </View>
        <GeneralButton
          style={styles.button}
          type="activePrimary"
          onPress={handlePressCreate}>
          Create / Replace
        </GeneralButton>
        <GeneralButton
          style={styles.button}
          type="activeSecondary"
          onPress={handlePressReveal}>
          Reveal Password
        </GeneralButton>
        <View>
          {revealedPassword !== undefined && (
            <View style={{ marginTop: 30 }}>
              <Typography type="commonTextBold">{`Your Password is: `}</Typography>
              <Typography type="commonText">{revealedPassword}</Typography>
            </View>
          )}
          {revealedPhrase !== undefined && (
            <View style={{ marginTop: 30 }}>
              <Typography type="commonTextBold">{`Your seed phrase is: `}</Typography>
              <Typography type="commonText">{revealedPhrase}</Typography>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EnterPassword;
