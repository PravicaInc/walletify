import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomButton from '../../components/shared/CustomButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { MyText } from '../../components/shared/myText';
import { MyTextInput } from '../../components/shared/MyTextInput';
import { ThemeContext } from '../../contexts/theme';
import PasswordShield from '../../assets/password-shield.svg';
import styles from './styles';
import { RootStackParamList } from '../routes';

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
    <CustomButton style={styles.button} type={'inactivePrimary'}>
      Confirm
    </CustomButton>
  );

  if (password.length > 0) {
    bottomButton = (
      <CustomButton
        style={styles.button}
        type={'activePrimary'}
        onPress={handleConfirm}>
        Confirm
      </CustomButton>
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
      <ScrollView contentContainerStyle={styles.container}>
        <KeyboardAvoidingView
          contentContainerStyle={styles.keyboardContainer}
          style={styles.keyboardContainer}
          // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={100}
          behavior="position">
          <View style={styles.scrollableContent}>
            <PasswordShield style={styles.shield} />
            <View>
              <MyText type="bigTitle" style={styles.title}>
                Enter Your Password
              </MyText>
            </View>
            <View>
              <MyText type="commonText" style={styles.description}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industryLorem Ipsum has beenLorem
              </MyText>
            </View>

            <MyTextInput
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
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OldPassword;
