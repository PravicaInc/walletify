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
import GeneralButton from '../../components/shared/GeneralButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { Typography } from '../../components/shared/Typography';
import { GeneralTextInput } from '../../components/shared/GeneralTextInput';
import { ThemeContext } from '../../contexts/theme';
import PasswordShield from '../../assets/password-shield.svg';
import styles from './styles';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'OldPassword'>;

const OldPassword = (props: Props) => {
  const { dispatch } = useNavigation();

  const seedPhrase = props.route.params?.seedPhrase;

  const passwordRef = useRef<TextInput>(null);

  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const isPasswordFocused = passwordRef.current?.isFocused;

  const handleConfirm = () => dispatch(StackActions.push('CreatePassword'));

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isPasswordFocused && isPasswordFocused() && password.length === 0) {
        setErrorMessage('Password is empty!');
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [password]);

  const handleGoBack = () => dispatch(StackActions.pop());

  let bottomButton = (
    <GeneralButton style={styles.button} type={'inactivePrimary'}>
      Confirm
    </GeneralButton>
  );

  if (password.length > 0) {
    bottomButton = (
      <GeneralButton
        style={styles.button}
        type={'activePrimary'}
        onPress={handleConfirm}>
        Confirm
      </GeneralButton>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <CustomAppHeader
        noBackText={false}
        handleGoBack={handleGoBack}
        containerStyle={{ shadowOpacity: 0 }}
        backColor={colors.primary100}
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
            <Typography type="commonText" style={styles.description}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industryLorem Ipsum has beenLorem
            </Typography>
          </View>

          <GeneralTextInput
            customStyle={[styles.input]}
            labelText="Enter a Password"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
            disableCancel
            ref={passwordRef}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
          />
          {bottomButton}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OldPassword;
