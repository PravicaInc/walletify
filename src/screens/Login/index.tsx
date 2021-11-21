import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { decryptMnemonic } from '@stacks/encryption';
import { UserCredentials } from 'react-native-keychain';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import PasswordShield from '../../assets/password-shield.svg';
import Warning from '../../assets/images/grey-warning.svg';
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
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
      setIsLoading(false);
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
        loginStyles.safeAreaContainer,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <View style={loginStyles.container}>
        <Header
          leftComponent={
            <HeaderBack
              text="Reset"
              customStyle={{ color: colors.failed100 }}
              onPress={() => {
                setPasswordValue('');
                setPasswordError(false);
              }}
            />
          }
          title="Password"
          rightComponent={
            <TouchableOpacity
              style={loginStyles.confirmContainer}
              onPress={handleConfirm}
              disabled={isLoading || passwordValue.length < 12}>
              {isLoading ? (
                <ActivityIndicator color={colors.primary40} />
              ) : (
                <Typography
                  type="buttonText"
                  style={[
                    {
                      color:
                        passwordValue.length < 12
                          ? colors.primary40
                          : colors.secondary100,
                    },
                  ]}>
                  Confirm
                </Typography>
              )}
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
          <Warning style={loginStyles.warningIcon} width={24} height={24} />
          <Typography
            type="commonText"
            style={[
              loginStyles.warningText,
              {
                color: colors.primary60,
              },
            ]}>
            Forgot password? We can’t recover what we don’t have, reset your
            wallet and enter a new password. Your assets will be kept safe.
          </Typography>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
