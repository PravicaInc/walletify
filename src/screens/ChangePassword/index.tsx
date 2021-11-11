import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  LayoutChangeEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import { ACCESS_CONTROL } from 'react-native-keychain';
import SecureKeychain from '../../shared/SecureKeychain';
import { useStores } from '../../hooks/useStores';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import HeaderConfirm from '../../components/shared/HeaderConfirm';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/theme';
import PasswordShield from '../../assets/password-shield.svg';
import styles from './styles';
import { validatePassword } from '../../components/shared/GeneralTextInput/validate-password';
import { decrypt } from '@stacks/wallet-sdk/dist';

type StrengthResultType = {
  finished: number;
  barsColor: string;
  textResult: StrengthLevel;
};

enum StrengthLevel {
  Powerful = 'Powerful',
  Neutral = 'Neutral',
  Weak = 'Weak',
}

let oldPasswordTimer: ReturnType<typeof setTimeout>;

const ChangePassword = observer(() => {
  // theme
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  // navigation
  const { dispatch } = useNavigation();
  const handleGoBack = () => dispatch(StackActions.pop());

  // old Password
  const oldPasswordRef = useRef<TextInput>(null);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [oldPwdErrorMsg, setOldPwdErrorMsg] = useState<string>('');
  useEffect(() => {
    oldPasswordTimer = setTimeout(() => {
      if (oldPassword.length === 0) {
        setOldPwdErrorMsg('Old Password cannot be empty');
      }
    }, 250);
    return () => {
      clearTimeout(oldPasswordTimer);
    };
  }, [oldPassword]);

  // password
  const passwordRef = useRef<TextInput>(null);
  const [password, setPassword] = useState<string>('');
  const [strengthResult, setStrengthResult] = useState<
    StrengthResultType | undefined
  >(undefined);
  const isPasswordFocused = passwordRef.current?.isFocused;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPasswordFocused && isPasswordFocused()) {
        const { meetsAllStrengthRequirements, meetsLengthRequirement, score } =
          validatePassword(password);
        let finished, barsColor, textResult;
        if (meetsAllStrengthRequirements) {
          finished = 3;
          barsColor = colors.confirm100;
          textResult = StrengthLevel.Powerful;
        } else if (meetsLengthRequirement && score === 3) {
          finished = 2;
          barsColor = colors.warning100;
          textResult = StrengthLevel.Neutral;
        } else {
          finished = 1;
          barsColor = colors.failed100;
          textResult = StrengthLevel.Weak;
        }

        setStrengthResult({ finished, barsColor, textResult });
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [password]);

  // repeatPassword
  const repeatPasswordRef = useRef<TextInput>(null);
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const [repeatPwdErrorMsg, setRepeatPwdErrorMsg] = useState<string>('');

  const isRepeatPasswordFocused = repeatPasswordRef.current?.isFocused;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        isRepeatPasswordFocused &&
        isRepeatPasswordFocused() &&
        password !== repeatPassword
      ) {
        setRepeatPwdErrorMsg(
          "Password and confirm password fields don't match!",
        );
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [repeatPassword]);

  // store and keychain
  const { walletStore, uiStore } = useStores();
  const { encryptedSeedPhrase, createWallet } = walletStore;
  const { isBiometryEnabled } = uiStore;

  // confirm handler
  const isValidInput =
    oldPassword.length > 0 &&
    repeatPassword === password &&
    strengthResult?.textResult &&
    ['Netural', 'Powerful'].includes(strengthResult?.textResult);
  const [loading, setLoading] = useState(false);
  const handlePressConfirm = async () => {
    setLoading(true);
    let seedPhrase = '';
    try {
      seedPhrase = await decrypt(encryptedSeedPhrase, oldPassword);
      await createWallet(seedPhrase, password);
      if (isBiometryEnabled) {
        await SecureKeychain.setGenericPassword(
          password,
          ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        );
      }
      dispatch(StackActions.pop());
    } catch (error: any) {
      setOldPwdErrorMsg('Your old password is wrong');
      setLoading(false);
      setOldPassword('');
      setPassword('');
      setOldPassword('');
    }
  };

  const [leftComponentWidth, setLeftComponentWidth] = useState<number>(0);
  const handleLayoutChange = (event: LayoutChangeEvent) => {
    let { width } = event.nativeEvent.layout;
    setLeftComponentWidth(width);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <View style={styles.container}>
        <Header
          leftComponent={
            <HeaderBack
              text="Cancel"
              customStyle={{ color: colors.secondary100 }}
              onPress={handleGoBack}
              onLayout={handleLayoutChange}
            />
          }
          leftComponentWidth={leftComponentWidth}
          title="Change Password"
          rightComponent={
            <HeaderConfirm
              text="Confirm"
              customStyle={{ color: colors.secondary100 }}
              disabled={!isValidInput}
              isLoading={loading}
              onPress={handlePressConfirm}
            />
          }
        />
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}>
          <ScrollView contentContainerStyle={styles.scrollableContent}>
            <PasswordShield />
            <View>
              <Typography type="bigTitle" style={styles.title}>
                Change Your Password
              </Typography>
            </View>
            <View style={styles.inputContainer}>
              <GeneralTextInput
                ref={oldPasswordRef}
                customStyle={styles.input}
                labelText="Enter Old Password"
                secureTextEntry
                onChangeText={setOldPassword}
                value={oldPassword}
                disableCancel
                setErrorMessage={setOldPwdErrorMsg}
                errorMessage={oldPwdErrorMsg}
              />

              <GeneralTextInput
                customStyle={styles.input}
                labelText="Enter a Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                disableCancel
                ref={passwordRef}
              />
              {strengthResult && (
                <View style={styles.passwordStrength}>
                  <ProgressBar
                    finished={strengthResult?.finished}
                    total={3}
                    barsColor={strengthResult?.barsColor}
                  />
                  <Typography
                    type="smallText"
                    style={{
                      color: strengthResult?.barsColor,
                    }}>
                    {` ${strengthResult?.textResult}`}
                  </Typography>
                </View>
              )}
              <GeneralTextInput
                ref={repeatPasswordRef}
                customStyle={styles.input}
                labelText="Re-enter a Password"
                secureTextEntry
                onChangeText={setRepeatPassword}
                value={repeatPassword}
                disableCancel
                setErrorMessage={setRepeatPwdErrorMsg}
                errorMessage={repeatPwdErrorMsg}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
});

export default ChangePassword;
