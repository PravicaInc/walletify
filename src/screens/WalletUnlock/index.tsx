import React, { useCallback, useContext, useRef, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { decryptMnemonic } from '@stacks/encryption';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import PasswordShield from '../../assets/password-shield.svg';
import WarningIcon from '../../components/shared/WarningIcon';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';
import { OptionsPick } from '../../components/OptionsPick';
import { usePasswordField } from '../../hooks/common/usePasswordField';
import { useProgressState } from '../../hooks/useProgressState';
import Animated from 'react-native-reanimated';
import { useKeyboardWithAnimation } from '../../hooks/common/useKeyboardWithAnimation';
import { useWallet } from '../../hooks/useWallet/useWallet';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import SecureKeychain from '../../shared/SecureKeychain';

interface IProps {
  nextAction: any;
  resetAction?: any;
  disableBack?: boolean;
}

export const WalletUnlockInner: React.FC<IProps> = ({
  nextAction,
  disableBack,
  resetAction,
}) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const {
    handleChangeText: handleChangePassword,
    error: passwordError,
    input: password,
    touched: passwordTouched,
    setError: setPasswordError,
  } = usePasswordField();
  const canGoNext = !passwordError && passwordTouched && password.length >= 12;
  const { loading, setLoading, setSuccess, setFailure } = useProgressState();
  const {
    userPreference: { encryptedSeedPhrase },
    clearUserPreference,
  } = useContext(UserPreferenceContext);
  const animatedStyles = useKeyboardWithAnimation();

  const { resetWallet } = useWallet();

  const decryptWallet = useCallback(
    async (userPassword: string) => {
      const seedDecrypted = await decryptMnemonic(
        encryptedSeedPhrase,
        userPassword,
      );
      nextAction(userPassword, seedDecrypted);
    },
    [encryptedSeedPhrase, nextAction],
  );

  const handleConfirm = useCallback(async () => {
    setLoading();
    try {
      await decryptWallet(password);
      setSuccess();
    } catch (err) {
      setPasswordError('This password seems incorrect! Try again.');
      setFailure();
    }
  }, [password]);

  const handlePresentResetWallet = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex(0);
  }, []);

  const handleResetWallet = useCallback(() => {
    SecureKeychain.resetGenericPassword().then(() => {
      bottomSheetModalRef.current?.collapse();
      resetWallet();
      clearUserPreference();
      if (resetAction) {
        resetAction();
      }
    });
  }, [resetAction]);

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
      edges={disableBack ? ['left', 'right'] : ['top', 'bottom']}
      style={[
        styles.safeAreaContainer,
        {
          backgroundColor: colors.white,
        },
      ]}>
      <Header
        leftComponent={
          !disableBack && (
            <HeaderBack
              text="Reset"
              customStyle={{ color: colors.failed100 }}
              onPress={handlePresentResetWallet}
            />
          )
        }
        title="Password"
        isRightLoading={loading}
        rightComponent={
          <TouchableOpacity
            style={styles.confirm}
            onPress={handleConfirm}
            disabled={!canGoNext}>
            <Typography
              type="buttonText"
              style={[
                {
                  color: canGoNext ? colors.primary100 : colors.secondary40,
                },
              ]}>
              Confirm
            </Typography>
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
        style={styles.contentViewContainer}
        keyboardVerticalOffset={10}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollableContent}>
          <View style={styles.fullWidth}>
            <Animated.View style={[styles.hiddenItems, animatedStyles]}>
              <PasswordShield />
              <Typography
                type="bigTitle"
                style={[styles.contentHeader, { color: colors.primary100 }]}>
                Enter Your Password
              </Typography>
              <Typography
                style={[styles.description, { color: colors.primary60 }]}
                type="commonText">
                Just to make sure it’s you! Enter your password to view your
                wallet.
              </Typography>
            </Animated.View>
            <GeneralTextInput
              customStyle={styles.input}
              labelText="Enter Password"
              secureTextEntry
              onChangeText={handleChangePassword}
              value={password}
              disableCancel
              errorMessage={passwordError}
            />
          </View>
          <View style={styles.hiddenItems}>
            <WarningIcon
              fill={colors.primary40}
              style={[styles.warningIcon]}
              width={24}
              height={24}
            />
            <Typography
              type="commonText"
              style={[
                styles.warningText,
                {
                  color: colors.primary60,
                },
              ]}>
              Forgot password? We can’t recover what we don’t have, reset your
              wallet and enter a new password. Your assets will be kept safe.
            </Typography>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

type Props = NativeStackScreenProps<RootStackParamList, 'WalletUnlock'>;

const WalletUnlock: React.FC<Props> = ({
  route: {
    params: { nextAction, resetAction },
  },
}) => {
  return (
    <WalletUnlockInner resetAction={resetAction} nextAction={nextAction} />
  );
};

export default WalletUnlock;
