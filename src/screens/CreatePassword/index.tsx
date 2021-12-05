import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Switch,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ACCESS_CONTROL, BIOMETRY_TYPE } from 'react-native-keychain';
import SecureKeychain from '../../shared/SecureKeychain';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/Theme/theme';
import PasswordShield from '../../assets/password-shield.svg';
import FingerPrint from '../../assets/finger-print.svg';
import WarningIcon from '../../components/shared/WarningIcon';
import styles from './styles';
import { validatePassword } from '../../components/shared/GeneralTextInput/validate-password';
import { RootStackParamList } from '../../navigation/types';
import { usePasswordField } from '../../hooks/common/usePasswordField';
import { useKeyboard } from '@react-native-community/hooks';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePassword'>;

enum StrengthLevel {
  Powerful = 'Powerful',
  Neutral = 'Neutral',
  Weak = 'Weak',
}

const CreatePassword: React.FC<Props> = ({
  route: {
    params: { nextScreen },
  },
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { dispatch } = useNavigation();
  const { keyboardShown } = useKeyboard();
  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: offset.value,
      height: offset.value * 220,
    };
  });
  const {
    userPreference: { hasSetBiometric },
    setHasEnabledBiometric,
  } = useContext(UserPreferenceContext);

  useEffect(() => {
    if (!keyboardShown) {
      offset.value = withTiming(1, {
        duration: 150,
      });
    } else {
      offset.value = withTiming(0, {
        duration: 150,
      });
    }
  }, [keyboardShown]);
  const [hasBioSupported, setHasBioSupported] = useState<BIOMETRY_TYPE | null>(
    null,
  );
  const [strengthLevel, setStrengthLevel] = useState<
    StrengthLevel | undefined
  >();

  const strengthLevelToBarMapper: {
    [x: string]: { activeIndex: number; color: string };
  } = useMemo(
    () => ({
      [StrengthLevel.Weak]: {
        activeIndex: 1,
        color: colors.failed100,
      },
      [StrengthLevel.Neutral]: {
        activeIndex: 2,
        color: colors.warning100,
      },
      [StrengthLevel.Powerful]: {
        activeIndex: 3,
        color: colors.confirm100,
      },
    }),
    [colors],
  );

  const {
    handleChangeText: handleChangePassword,
    error: passwordError,
    input: password,
    touched: passwordTouched,
  } = usePasswordField((inputValue: string) => {
    const { meetsAllStrengthRequirements, meetsLengthRequirement, score } =
      validatePassword(inputValue);
    if (!meetsLengthRequirement) {
      throw Error('You need at least 12 characters');
    } else if (meetsAllStrengthRequirements) {
      setStrengthLevel(StrengthLevel.Powerful);
    } else if (score === 3) {
      setStrengthLevel(StrengthLevel.Neutral);
    } else {
      setStrengthLevel(StrengthLevel.Weak);
    }
  });
  const {
    handleChangeText: handleChangeConfirmPassword,
    error: confirmPasswordError,
    input: confirmPassword,
    touched: confirmPasswordTouched,
  } = usePasswordField(
    (inputValue: string) => {
      if (password !== inputValue) {
        throw Error('The password does not match!');
      }
    },
    [password],
  );

  useEffect(() => {
    SecureKeychain.getSupportedBiometryType().then(type =>
      setHasBioSupported(type),
    );
  }, []);

  const canGoNext =
    !confirmPasswordError &&
    !passwordError &&
    passwordTouched &&
    confirmPasswordTouched;

  const handleGoBack = useCallback(() => dispatch(StackActions.pop()), []);

  const handlePressCreate = useCallback(async () => {
    try {
      if (hasSetBiometric) {
        await SecureKeychain.setGenericPassword(
          password,
          ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
        );
      }
      dispatch(StackActions.push(nextScreen, { password }));
    } catch (e) {
      console.log(e);
    }
  }, [hasSetBiometric, nextScreen, password]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        leftComponent={
          <HeaderBack
            customStyle={styles.back}
            onPress={handleGoBack}
            text="Back"
            hasChevron
          />
        }
      />
      {nextScreen === 'ShowSeedPhrase' && (
        <ProgressBar
          currentBarIdx={1}
          total={3}
          customStyle={styles.progress}
        />
      )}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollableContent}>
          <View style={styles.pusher}>
            <Animated.View style={[styles.hiddenItems, animatedStyles]}>
              <PasswordShield />
              <Typography type="bigTitle" style={styles.title}>
                Create Your Password
              </Typography>
              <Typography
                type="commonText"
                style={[styles.description, { color: colors.primary60 }]}>
                Your password encrypts your Secret Key and confirms all your
                transactions.
              </Typography>
            </Animated.View>
          </View>
          <GeneralTextInput
            autoFocus={true}
            customStyle={styles.input}
            labelText="Enter a Password"
            secureTextEntry
            onChangeText={handleChangePassword}
            value={password}
            disableCancel
            errorMessage={passwordError}
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
                {strengthLevel && (
                  <View style={styles.passwordStrength}>
                    <ProgressBar
                      currentBarIdx={
                        strengthLevelToBarMapper[strengthLevel].activeIndex
                      }
                      total={3}
                      barsColor={strengthLevelToBarMapper[strengthLevel].color}
                      barIsCircle
                    />
                    <Typography
                      type="smallText"
                      style={{
                        color: strengthLevelToBarMapper[strengthLevel].color,
                      }}>
                      {strengthLevel}
                    </Typography>
                  </View>
                )}
              </View>
            }
          />
          <GeneralTextInput
            customStyle={styles.input}
            outerWrapperStyle={styles.bottomInput}
            labelText="Re-enter a Password"
            secureTextEntry
            onChangeText={handleChangeConfirmPassword}
            value={confirmPassword}
            disableCancel
            errorMessage={confirmPasswordError}
          />
          <View style={styles.switchGroupContainer}>
            <View style={styles.switchTop}>
              <View style={styles.fingerprintContainer}>
                <FingerPrint />
              </View>
              <View style={styles.switchLabel}>
                <Typography type="smallTitleR">Allow Biometrics</Typography>
              </View>
              <View style={styles.switch}>
                <Switch
                  onChange={event => setHasEnabledBiometric(event.value)}
                  value={hasSetBiometric}
                  disabled={!hasBioSupported}
                />
              </View>
            </View>
            <View style={styles.switchBottom}>
              <View style={styles.fingerprintContainer} />
              <View style={styles.switchLabel}>
                <Typography
                  type="commonText"
                  style={{ color: colors.primary40 }}>
                  You can Authenticate and Sign transactions using your
                  biometrics.
                </Typography>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={handlePressCreate}
            disabled={!canGoNext}
            style={[
              styles.button,
              styles.pusher,
              {
                backgroundColor: canGoNext
                  ? colors.primary100
                  : colors.primary20,
              },
            ]}>
            <Typography type="buttonText" style={{ color: colors.white }}>
              Create
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePassword;
