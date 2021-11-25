import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { ACCESS_CONTROL } from 'react-native-keychain';
import { decryptMnemonic } from '@stacks/encryption';
import SecureKeychain from '../../shared/SecureKeychain';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/Theme/theme';
import PasswordShield from '../../assets/password-shield.svg';
import WarningIcon from '../../components/shared/WarningIcon';
import { validatePassword } from '../../components/shared/GeneralTextInput/validate-password';
import styles from './styles';

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

const ChangePassword = () => {
  // theme
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  // navigation
  const { dispatch } = useNavigation();

  // store and keychain
  const {
    userPreference: { encryptedSeedPhrase, hasSetBiometric },
  } = useContext(UserPreferenceContext);

  // passwords
  const [oldPassword, setOldPassword] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [oldPwdErrorMsg, setOldPwdErrorMsg] = useState<string>('');
  const [pwdErrorMsg, setPwdErrorMsg] = useState<string>('');
  const [confirmPwdErrorMsg, setConfirmPwdErrorMsg] = useState<string>('');

  const [oldPwdChanged, setOldPwdChanged] = useState(false);
  const [pwdChanged, setPwdChanged] = useState(false);
  const [confirmPwdChanged, setConfirmPwdChanged] = useState(false);

  const [strengthResult, setStrengthResult] = useState<
    StrengthResultType | undefined
  >(undefined);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (oldPwdChanged) {
        if (oldPassword.length < 12) {
          setOldPwdErrorMsg('You need at least 12 characters');
        } else {
          setOldPwdErrorMsg('');
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [oldPassword, oldPwdChanged]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (pwdChanged) {
        if (password.length < 12) {
          setPwdErrorMsg('You need at least 12 characters');
          setStrengthResult(undefined);
        } else {
          const {
            meetsAllStrengthRequirements,
            meetsLengthRequirement,
            score,
          } = validatePassword(password);
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
          setPwdErrorMsg('');
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [
    password,
    colors.confirm100,
    colors.failed100,
    colors.warning100,
    pwdChanged,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (confirmPwdChanged) {
        if (password !== confirmPassword) {
          setConfirmPwdErrorMsg('The password does not match!');
        } else {
          setConfirmPwdErrorMsg('');
        }
      }
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [confirmPassword, password, pwdChanged, confirmPwdChanged]);

  // confirm handler
  const isValidInput =
    oldPassword.length >= 12 &&
    password.length >= 12 &&
    confirmPassword === password;

  const [loading, setLoading] = useState(false);

  // handlers
  const handleGoBack = () => dispatch(StackActions.pop());
  const handlePressConfirm = async () => {
    setLoading(true);

    try {
      await decryptMnemonic(encryptedSeedPhrase, oldPassword);
      if (hasSetBiometric) {
        await SecureKeychain.setGenericPassword(
          password,
          ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        );
      }
      dispatch(StackActions.pop());
    } catch (error: any) {
      setLoading(false);
      setOldPassword('');
      setPassword('');
      setPwdChanged(false);
      setConfirmPassword('');
      setConfirmPwdChanged(false);
      setStrengthResult(undefined);
      setOldPwdErrorMsg('The password is incorrect!');
    }
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
            />
          }
          title="Change Password"
          rightComponent={
            <TouchableOpacity
              style={styles.confirmContainer}
              onPress={handlePressConfirm}
              disabled={!isValidInput || loading}>
              {loading ? (
                <ActivityIndicator color={colors.primary40} />
              ) : (
                <Typography
                  type="buttonText"
                  style={[
                    { color: colors.secondary100 },
                    !isValidInput && { color: colors.primary40 },
                  ]}>
                  Confirm
                </Typography>
              )}
            </TouchableOpacity>
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
              <View style={styles.inputWrapper}>
                <GeneralTextInput
                  customStyle={styles.input}
                  labelText="Enter Old Password"
                  secureTextEntry
                  onChangeText={txt => {
                    setOldPassword(txt);
                    setOldPwdChanged(true);
                  }}
                  value={oldPassword}
                  disableCancel
                  errorMessage={oldPwdErrorMsg}
                  normalInput={true}
                />
              </View>
              <View style={styles.inputWrapper}>
                <GeneralTextInput
                  normalInput={true}
                  customStyle={styles.input}
                  labelText="Enter a Password"
                  secureTextEntry
                  onChangeText={txt => {
                    setPassword(txt);
                    setPwdChanged(true);
                  }}
                  value={password}
                  disableCancel
                  errorMessage={pwdErrorMsg}
                  guide={
                    <View style={styles.inputGuide}>
                      <View style={styles.caution}>
                        <WarningIcon fill={colors.primary40} />
                        <Typography
                          type="smallText"
                          style={{ color: colors.primary40 }}>
                          You need at least 12 characters
                        </Typography>
                      </View>
                      {strengthResult && (
                        <View style={styles.passwordStrength}>
                          <ProgressBar
                            currentBarIdx={strengthResult?.finished}
                            total={3}
                            barsColor={strengthResult?.barsColor}
                            barIsCircle
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
                    </View>
                  }
                />
              </View>
              <View style={styles.inputWrapper}>
                <GeneralTextInput
                  customStyle={styles.input}
                  labelText="Re-enter a Password"
                  secureTextEntry
                  onChangeText={txt => {
                    setConfirmPassword(txt);
                    setConfirmPwdChanged(true);
                  }}
                  value={confirmPassword}
                  disableCancel
                  errorMessage={confirmPwdErrorMsg}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;
