import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BIOMETRY_TYPE, ACCESS_CONTROL } from 'react-native-keychain';
import SecureKeychain from '../../shared/SecureKeychain';
import GeneralButton from '../../components/shared/GeneralButton';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/Theme/theme';
import PasswordShield from '../../assets/password-shield.svg';
import FingerPrint from '../../assets/finger-print.svg';
import WarningIcon from '../../assets/images/grey-warning.svg';
import styles from './styles';
import { validatePassword } from '../../components/shared/GeneralTextInput/validate-password';
import { RootStackParamList, WalletSetupFlow } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePassword'>;

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

const CreatePassword = (props: Props) => {
  // theme
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  // navigation
  const { dispatch } = useNavigation();

  // biometrics
  const {
    userPreference: { hasSetBiometric },
    setHasEnabledBiometric,
  } = useContext(UserPreferenceContext);
  const [isBioSwitchOn, setisBioSwitchOn] = useState(hasSetBiometric);
  const [hasBioSupported, setHasBioSupported] = useState<BIOMETRY_TYPE | null>(
    null,
  );
  const getBioSupport = async () => {
    const type = await SecureKeychain.getSupportedBiometryType();
    setHasBioSupported(type);
  };
  useEffect(() => {
    getBioSupport();
  }, []);

  // password and its confirmation
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [pwdErrorMsg, setPwdErrorMsg] = useState<string>('');
  const [confirmPwdErrorMsg, setConfirmPwdErrorMsg] = useState<string>('');

  const [pwdChanged, setPwdChanged] = useState(false);
  const [confirmPwdChanged, setConfirmPwdChanged] = useState(false);

  const [strengthResult, setStrengthResult] = useState<
    StrengthResultType | undefined
  >(undefined);

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

  const isValidInput =
    password.length >= 12 &&
    confirmPassword === password &&
    strengthResult?.textResult;
  const flow = props.route.params?.flow;

  // handlers
  const handleGoBack = () => dispatch(StackActions.pop());
  const handlePressCreate = async () => {
    setHasEnabledBiometric(isBioSwitchOn);
    try {
      if (isBioSwitchOn) {
        await SecureKeychain.setGenericPassword(
          password,
          ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        );
      }
      const nextPage =
        flow === WalletSetupFlow.CreateWallet
          ? 'ShowSeedPhrase'
          : 'SeedRestore';
      dispatch(StackActions.push(nextPage, { password }));
    } catch (e) {
      console.log(e);
    }
  };

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
            <PasswordShield />
            <View>
              <Typography type="bigTitle" style={styles.title}>
                Create Your Password
              </Typography>
            </View>
            <View>
              <Typography
                type="commonText"
                style={[styles.description, { color: colors.primary60 }]}>
                Create a password for inApp permissions
              </Typography>
            </View>

            <GeneralTextInput
              autoFocus={true}
              customStyle={styles.input}
              labelText="Enter a Password"
              secureTextEntry
              selectTextOnFocus={false}
              clearTextOnFocus={false}
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
                    <WarningIcon />
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
            <View style={styles.bottomInput}>
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
            <View style={styles.switchContainer}>
              <View style={styles.switchLabelContainer}>
                <FingerPrint style={styles.switchLabelIcon} />
                <Typography type="smallTitleR">Sign With Biometrics</Typography>
              </View>
              <Switch
                onChange={() => setisBioSwitchOn(prevState => !prevState)}
                value={isBioSwitchOn}
                disabled={!hasBioSupported}
              />
            </View>
            <GeneralButton
              style={styles.button}
              onPress={handlePressCreate}
              type={isValidInput ? 'activePrimary' : 'inactivePrimary'}>
              Create
            </GeneralButton>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default CreatePassword;
