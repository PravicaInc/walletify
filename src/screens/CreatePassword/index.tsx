import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import { BIOMETRY_TYPE, ACCESS_CONTROL } from 'react-native-keychain';
import SecureKeychain from '../../shared/SecureKeychain';
import { useStores } from '../../hooks/useStores';
import GeneralButton from '../../components/shared/GeneralButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/theme';
import PasswordShield from '../../assets/password-shield.svg';
import FingerPrint from '../../assets/finger-print.svg';
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

const CreatePassword = observer((props: Props) => {
  // theme
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  // navigation
  const { dispatch } = useNavigation();
  const flow = props.route.params?.flow;
  const handleGoBack = () => dispatch(StackActions.pop());

  // biometrics
  const { uiStore } = useStores();
  const { setIsBiometryEnabled } = uiStore;
  const [isBioSwitchOn, setisBioSwitchOn] = useState(false);
  const [hasBioSetup, setHasBioSetup] = useState<BIOMETRY_TYPE | null>(null);
  const getBioSetup = async () => {
    const type = await SecureKeychain.getSupportedBiometryType();
    setHasBioSetup(type);
  };
  useEffect(() => {
    getBioSetup();
  }, []);

  // password and its confirmation
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);
  const [strengthResult, setStrengthResult] = useState<
    StrengthResultType | undefined
  >(undefined);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
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
  const isConfirmPasswordFocused = confirmPasswordRef.current?.isFocused;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        isConfirmPasswordFocused &&
        isConfirmPasswordFocused() &&
        password !== confirmPassword
      ) {
        setErrorMessage("Password and confirm password fields don't match!");
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [confirmPassword]);
  const isValidInput =
    confirmPassword === password &&
    strengthResult?.textResult &&
    ['Netural', 'Powerful'].includes(strengthResult?.textResult);
  const handlePressCreate = async () => {
    setIsBiometryEnabled(isBioSwitchOn);
    try {
      if (isBioSwitchOn) {
        await SecureKeychain.setGenericPassword(
          password,
          ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        );
      }
      const nextPage =
        flow === WalletSetupFlow.CreateWallet
          ? 'SeedGeneration'
          : 'SeedRestore';
      dispatch(StackActions.push(nextPage, { password }));
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
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
          <PasswordShield />
          <View>
            <Typography type="bigTitle" style={styles.title}>
              Create Your Password
            </Typography>
          </View>
          <View>
            <Typography type="commonText" style={styles.description}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industryLorem Ipsum has beenLorem
            </Typography>
          </View>

          <GeneralTextInput
            customStyle={[styles.input, styles.topInput]}
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
          <View style={styles.bottomInput}>
            <GeneralTextInput
              ref={confirmPasswordRef}
              customStyle={styles.input}
              labelText="Re-enter a Password"
              secureTextEntry
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              disableCancel
              setErrorMessage={setErrorMessage}
              errorMessage={errorMessage}
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
              disabled={!hasBioSetup}
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
    </SafeAreaView>
  );
});

export default CreatePassword;
