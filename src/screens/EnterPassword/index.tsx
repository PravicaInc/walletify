import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { generateWallet, decrypt } from '@stacks/wallet-sdk/dist';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import HeaderConfirm from '../../components/shared/HeaderConfirm';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/theme';
import PasswordShield from '../../assets/password-shield.svg';
import styles from './styles';
import { RootStackParamList } from '../../navigation/types';
import { useStores } from '../../hooks/useStores';

type Props = NativeStackScreenProps<RootStackParamList, 'EnterPassword'>;

const EnterPassword = (props: Props) => {
  const { dispatch, navigate } = useNavigation();

  const passwordRef = useRef<TextInput>(null);

  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordFocused = passwordRef.current?.isFocused;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        isPasswordFocused &&
        isPasswordFocused() &&
        password.length === 0 &&
        errorMessage.length === 0
      ) {
        setErrorMessage('Password is empty!');
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [password, errorMessage]);

  const handleGoBack = () => dispatch(StackActions.pop());

  const { walletStore } = useStores();
  const { encryptedSeedPhrase } = walletStore;
  const nextScreen = props.route.params?.nextScreen;

  const handleGoNext = async () => {
    setIsLoading(true);
    try {
      const seedPhrase = await decrypt(encryptedSeedPhrase, password);
      await generateWallet({
        secretKey: seedPhrase,
        password,
      });
      const params = nextScreen === 'Settings' ? { password } : { seedPhrase };
      navigate(nextScreen, params);
    } catch (e) {
      setPassword('');
      setErrorMessage('The password you entered is wrong');
      setIsLoading(false);
    }
  };

  const descriptionStyle = [styles.description, { color: colors.primary60 }];

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
          title="Password"
          rightComponent={
            <HeaderConfirm
              text="Confirm"
              customStyle={{ color: colors.secondary100 }}
              disabled={password.length === 0}
              isLoading={isLoading}
              onPress={handleGoNext}
            />
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
              <Typography type="commonText" style={descriptionStyle}>
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
              ref={passwordRef}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

export default EnterPassword;
