import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { decryptMnemonic } from '@stacks/encryption';
import { UserCredentials } from 'react-native-keychain';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import PasswordShield from '../../assets/password-shield.svg';
import Warning from '../../assets/images/warning.svg';
import SecureKeychain from '../../shared/SecureKeychain';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import { ThemeContext } from '../../contexts/Theme/theme';
import loginStyles from './styles';

const Login: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [passwordValue, setPasswordValue] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean | undefined>(
    undefined,
  );
  const {
    userPreference: { encryptedSeedPhrase, hasSetBiometric },
  } = useContext(UserPreferenceContext);
  const { dispatch } = useNavigation();

  const validateUserCredentials = useCallback(async () => {
    if (hasSetBiometric) {
      const userCredentials = await SecureKeychain.getGenericPassword();
      const seedDecrypted = await decryptMnemonic(
        encryptedSeedPhrase,
        (userCredentials as UserCredentials).password,
      );
      dispatch(
        StackActions.replace('Home', {
          password: userCredentials?.password,
          seedPhrase: seedDecrypted,
        }),
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [encryptedSeedPhrase]);

  useEffect(() => {
    validateUserCredentials();
  }, [hasSetBiometric]);

  const handleConfirm = async () => {
    try {
      const seedDecrypted = await decryptMnemonic(
        encryptedSeedPhrase,
        passwordValue,
      );
      dispatch(
        StackActions.replace('Home', {
          password: passwordValue,
          seedPhrase: seedDecrypted,
        }),
      );
    } catch (err) {
      setPasswordError(true);
    }
  };

  const handleOnChangePassword = (pass: string) => {
    setPasswordValue(pass);
    if (passwordError) {
      setPasswordError(undefined);
    }
  };

  return (
    <SafeAreaView
      style={[
        loginStyles.container,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <CustomAppHeader
        containerStyle={loginStyles.screenHeader}
        noBackText
        isCancel
        customNext={
          <TouchableOpacity onPress={handleConfirm}>
            <Typography
              type="buttonText"
              style={{ color: colors.secondary100 }}>
              Confirm
            </Typography>
          </TouchableOpacity>
        }
      />
      <KeyboardAvoidingView
        style={loginStyles.contentViewContainer}
        keyboardVerticalOffset={50}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <PasswordShield />
        <Typography
          type="bigTitle"
          style={[loginStyles.contentHeader, { color: colors.primary100 }]}>
          Enter Your Password
        </Typography>
        <Typography
          style={[loginStyles.description, { color: colors.primary60 }]}
          type="commonText">
          Just to make sure it’s you! Enter your password to view your wallet.
        </Typography>
        <View style={loginStyles.passwordInputFieldContainer}>
          <Typography
            type="commonText"
            style={[
              loginStyles.passwordInputFieldLabel,
              { color: colors.primary100 },
            ]}>
            Enter Password
          </Typography>
          <GeneralTextInput
            customStyle={loginStyles.passwordInputField}
            secureTextEntry
            onChangeText={handleOnChangePassword}
            value={passwordValue}
            disableCancel
          />
          {passwordError && (
            <Typography
              type="smallText"
              style={[
                loginStyles.passwordErrorMessage,
                { color: colors.failed100 },
              ]}>
              This password seems incorrect! Try again.
            </Typography>
          )}
        </View>
      </KeyboardAvoidingView>
      <View style={loginStyles.warningContainer}>
        <Warning style={loginStyles.warningIcon} />
        <Typography
          type="commonText"
          style={[
            loginStyles.warningText,
            {
              color: colors.failed100,
            },
          ]}>
          Forgot password? We can’t recover what we don’t have, reset your
          wallet and enter a new password. Your assets will be kept safe.
        </Typography>
      </View>
    </SafeAreaView>
  );
};

export default Login;
