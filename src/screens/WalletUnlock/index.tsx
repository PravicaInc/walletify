import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
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
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import PasswordShield from '../../assets/password-shield.svg';
import WarningIcon from '../../components/shared/WarningIcon';
import SecureKeychain from '../../shared/SecureKeychain';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import { ThemeContext } from '../../contexts/Theme/theme';
import loginStyles from './styles';
import { OptionsPick } from '../../components/OptionsPick';

const WalletUnlock: React.FC = () => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

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
    clearUserPreference,
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

  const handlePressReset = () => {
    setPasswordValue('');
    setPasswordError(false);
    handlePresentResetWallet();
  };

  const handlePresentResetWallet = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex(0);
  }, []);

  const handleResetWallet = () => {
    bottomSheetModalRef.current?.collapse();
    clearUserPreference();
    dispatch(StackActions.replace('OnBoarding'));
  };

  const options = useMemo(() => {
    return [
      {
        label: 'OK Reset',
        onClick: handleResetWallet,
        optionTextStyle: {
          color: colors.failed100,
        },
      },
    ];
  }, [colors, handleResetWallet]);

  return (
    <SafeAreaView
      style={[
        loginStyles.safeAreaContainer,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <View style={[loginStyles.container]}>
        <Header
          leftComponent={
            <HeaderBack
              text="Reset"
              customStyle={{ color: colors.failed100 }}
              onPress={handlePressReset}
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
        <OptionsPick
          options={options}
          userIcon={<WarningIcon width={80} height={80} />}
          title="Reset Wallet"
          subTitle="Losing the password doesn't matter as much, because as long as you have the Secret Key you can restore your wallet and set up a new password."
          ref={bottomSheetModalRef}
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
          <WarningIcon
            fill={colors.primary40}
            style={loginStyles.warningIcon}
            width={24}
            height={24}
          />
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

export default WalletUnlock;
