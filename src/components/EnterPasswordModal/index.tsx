import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { decryptMnemonic } from '@stacks/encryption';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { Typography } from '../shared/Typography';
import { GeneralTextInput } from '../shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/Theme/theme';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import PasswordShield from '../../assets/password-shield.svg';
import styles from './styles';

type Props = {
  handleNextAction: (props: { password: string; seedPhrase: string }) => void;
};

const EnterPasswordModal = React.forwardRef<any, Props>(
  ({ handleNextAction }, ref) => {
    const {
      userPreference: { encryptedSeedPhrase },
    } = useContext(UserPreferenceContext);

    const {
      theme: { colors },
    } = useContext(ThemeContext);
    const [password, setPassword] = useState<string>('');
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const snapPoints = useMemo(() => ['95%'], []);

    const handleDismissModal = useCallback(() => {
      if (ref) {
        setPassword('');
        setIsLoading(false);
        ref.current?.dismiss();
      }
    }, [ref]);

    const handleGoNext = async () => {
      setIsLoading(true);
      try {
        const seedPhrase = await decryptMnemonic(encryptedSeedPhrase, password);
        handleNextAction({ password, seedPhrase });
        setPassword('');
        setIsLoading(false);
        handleDismissModal();
      } catch (e) {
        setPassword('');
        setErrorMessage('The password is incorrect!');
        setIsLoading(false);
      }
    };

    const rightComponent = useCallback(
      () => (
        <TouchableOpacity
          style={styles.confirmContainer}
          onPress={handleGoNext}
          disabled={isLoading || password.length === 0}>
          {isLoading ? (
            <ActivityIndicator color={colors.primary40} />
          ) : (
            <Typography
              type="buttonText"
              style={[
                {
                  color:
                    password.length === 0
                      ? colors.primary40
                      : colors.secondary100,
                },
              ]}>
              Confirm
            </Typography>
          )}
        </TouchableOpacity>
      ),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [password, isLoading],
    );

    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    return (
      <BottomSheetModal
        snapPoints={snapPoints}
        ref={ref}
        index={0}
        backdropComponent={renderBackdrop}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: colors.white,
            },
          ]}>
          <Header
            leftComponent={
              <HeaderBack
                text="Cancel"
                customStyle={{ color: colors.secondary100 }}
                onPress={handleDismissModal}
              />
            }
            title="Password"
            rightComponent={rightComponent}
          />
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}>
            <ScrollView contentContainerStyle={styles.scrollableContent}>
              <PasswordShield style={styles.shield} />
              <View>
                <Typography type="bigTitle" style={styles.title}>
                  Enter Your Password
                </Typography>
              </View>
              <View>
                <Typography
                  type="commonText"
                  style={[styles.description, { color: colors.primary60 }]}>
                  Just to make sure it's you!
                </Typography>
              </View>
              <GeneralTextInput
                customStyle={[styles.input]}
                labelText="Enter Your Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                disableCancel
                errorMessage={errorMessage}
                normalInput={false}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </BottomSheetModal>
    );
  },
);

export default EnterPasswordModal;
