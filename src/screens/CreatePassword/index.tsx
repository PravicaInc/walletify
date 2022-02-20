import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ACCESS_CONTROL } from 'react-native-keychain';
import {
  request,
  PERMISSIONS,
  check,
  openSettings,
  RESULTS,
} from 'react-native-permissions';
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
import Animated from 'react-native-reanimated';
import { useKeyboardWithAnimation } from '../../hooks/common/useKeyboardWithAnimation';
import { useProgressState } from '../../hooks/useProgressState';
import { GeneralSwitch } from '../../components/shared/GeneralSwitch';
import { decryptMnemonic } from '@stacks/encryption';

type Props = NativeStackScreenProps<RootStackParamList, 'CreatePassword'>;

enum StrengthLevel {
  Powerful = 'Powerful',
  Neutral = 'Neutral',
  Weak = 'Weak',
}

const CreatePassword: React.FC<Props> = ({
  route: {
    params: { nextScreen, handleEditPassword },
  },
}) => {
  const isEditPassword = !!handleEditPassword;
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { dispatch } = useNavigation();
  const { loading, setFailure, setSuccess, setLoading } = useProgressState();
  const {
    userPreference: { encryptedSeedPhrase },
    setHasEnabledBiometric,
  } = useContext(UserPreferenceContext);
  const animatedStyles = useKeyboardWithAnimation();
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);
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
    handleChangeText: handleChangeOldPassword,
    error: oldPasswordError,
    setError: setOldPasswordError,
    input: oldPassword,
  } = usePasswordField(async (inputValue: string) => {
    if (inputValue.length < 12) {
      throw Error('You need at least 12 characters');
    } else {
      try {
        await decryptMnemonic(encryptedSeedPhrase, password);
      } catch (e) {
        throw Error('The password is incorrect!');
      }
    }
  });
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

    return Promise.resolve();
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

      return Promise.resolve();
    },
    [password],
  );

  const handleEditConfirm = useCallback(() => {
    setLoading();
    handleEditPassword(oldPassword, password)
      .then(setSuccess)
      .catch(e => {
        setOldPasswordError(e);
        setFailure();
      });
  }, [handleEditPassword, password, oldPassword]);

  const canGoNext =
    (isEditPassword ? oldPassword.length >= 12 : true) &&
    !confirmPasswordError &&
    !passwordError &&
    passwordTouched &&
    confirmPasswordTouched;

  const handleGoBack = useCallback(() => dispatch(StackActions.pop()), []);

  const handlePressCreate = useCallback(async () => {
    try {
      if (biometricEnabled) {
        await SecureKeychain.setGenericPassword(
          password,
          ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
        );
        setHasEnabledBiometric(biometricEnabled);
      }
      dispatch(StackActions.push(nextScreen, { password }));
    } catch (e) {
      console.log(e);
    }
  }, [biometricEnabled, nextScreen, password]);

  const handleToggleBiometric = (value: boolean) => {
    if (value) {
      check(PERMISSIONS.IOS.FACE_ID).then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            break;
          case RESULTS.DENIED:
            request(PERMISSIONS.IOS.FACE_ID).then(requestResult => {
              if (requestResult !== 'granted') {
                setBiometricEnabled(false);
              } else {
                setBiometricEnabled(true);
              }
            });
            break;
          case RESULTS.LIMITED:
            setBiometricEnabled(true);
            break;
          case RESULTS.GRANTED:
            setBiometricEnabled(true);
            break;
          case RESULTS.BLOCKED:
            openSettings();
            break;
        }
      });
    } else {
      setBiometricEnabled(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        containerStyles={styles.header}
        leftComponent={<HeaderBack onPress={handleGoBack} hasChevron isBack />}
        title={isEditPassword && 'Change Password'}
        isRightLoading={loading}
        rightComponent={
          isEditPassword && (
            <TouchableOpacity
              style={styles.confirmContainer}
              onPress={handleEditConfirm}
              disabled={!canGoNext || loading}>
              <Typography
                type="buttonText"
                style={[
                  { color: colors.secondary100 },
                  !canGoNext && { color: colors.primary40 },
                ]}>
                Confirm
              </Typography>
            </TouchableOpacity>
          )
        }
      />
      {nextScreen === 'CreateSeedPhrase' && (
        <ProgressBar
          currentBarIdx={1}
          total={3}
          customStyle={styles.progress}
        />
      )}
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}>
        <ScrollView
          scrollEnabled={isEditPassword}
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
          {isEditPassword && (
            <GeneralTextInput
              customStyle={styles.input}
              outerWrapperStyle={styles.bottomInput}
              labelText="Enter Old Password"
              secureTextEntry
              onChangeText={handleChangeOldPassword}
              value={oldPassword}
              disableCancel
              errorMessage={oldPasswordError}
            />
          )}
          <GeneralTextInput
            autoFocus={!isEditPassword && true}
            customStyle={styles.input}
            outerWrapperStyle={isEditPassword && styles.bottomInput}
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
          {isEditPassword ? (
            <View style={styles.pusher} />
          ) : (
            <>
              <View style={styles.switchGroupContainer}>
                <View style={styles.switchTop}>
                  <View style={styles.fingerprintContainer}>
                    <FingerPrint />
                  </View>
                  <View style={styles.switchLabel}>
                    <Typography type="smallTitleR">Allow Biometrics</Typography>
                  </View>
                  <View style={styles.switch}>
                    <GeneralSwitch
                      toggleLock={handleToggleBiometric}
                      isLocked={biometricEnabled}
                      switchPx={2.5}
                      backgroundInactive={colors.card}
                      backgroundActive={colors.confirm100}
                      switchCircleStyle={[
                        styles.shadow,
                        {
                          shadowColor: colors.primary20,
                          backgroundColor: colors.white,
                        },
                      ]}
                      barHeight={31}
                      circleSize={27}
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
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreatePassword;
