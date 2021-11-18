import React, { useContext, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { decryptMnemonic } from '@stacks/encryption';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/theme';
import PasswordShield from '../../assets/password-shield.svg';
import styles from './styles';
import { useStores } from '../../hooks/useStores';

type Props = {
  handleNextAction: (props: { password: string; seedPhrase: string }) => void;
  toggleEnterPassword: () => void;
  enterPasswordVisible: boolean;
};

const EnterPasswordModal = ({
  handleNextAction,
  toggleEnterPassword,
  enterPasswordVisible,
}: Props) => {
  const { walletStore } = useStores();
  const { encryptedSeedPhrase } = walletStore;

  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGoNext = async () => {
    setIsLoading(true);
    try {
      const enteredPassword = password;
      const seedPhrase = await decryptMnemonic(
        encryptedSeedPhrase,
        enteredPassword,
      );
      handleNextAction({ password: enteredPassword, seedPhrase });
      setPassword('');
      setIsLoading(false);
    } catch (e) {
      setPassword('');
      setErrorMessage('The password is incorrect!');
      setIsLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={enterPasswordVisible}>
      <SafeAreaView
        style={[
          styles.safeAreaContainer,
          { backgroundColor: colors.primary40 },
        ]}
        edges={['right', 'top', 'left']}>
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
                onPress={toggleEnterPassword}
              />
            }
            title="Password"
            rightComponent={
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
            }
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
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default EnterPasswordModal;
