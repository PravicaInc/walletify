import React, { useContext, useEffect, useState } from 'react';
import { View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/shared/CustomButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { MyText } from '../../components/shared/myText';
import ProgressBar from '../../components/ProgressBar';
import { MyTextInput } from '../../components/shared/MyTextInput';
import { ThemeContext } from '../../contexts/theme';
import PasswordShield from '../../assets/password-shield.svg';
import styles from './styles';
import { validatePassword } from '../../components/shared/MyTextInput/validate-password';

const EnterPassword: React.FC = () => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [strengthResult, setStrengthResult] = useState(validatePassword(''));
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setStrengthResult(validatePassword(password));
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [password]);
  const handleGoBack = () => dispatch(StackActions.pop());
  console.warn('strengthResult', strengthResult.meetsAllStrengthRequirements);
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <CustomAppHeader
        noBackText={false}
        handleGoBack={handleGoBack}
        containerStyle={{ shadowOpacity: 0 }}
        backColor={colors.primary100}
      />
      <KeyboardAvoidingView
        contentContainerStyle={styles.contentContainer}
        style={styles.keyboardContainer}
        keyboardVerticalOffset={0}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ProgressBar finished={2} total={2} />
        <PasswordShield style={styles.shield} />
        <View>
          <MyText type="bigTitle" style={styles.title}>
            Your Password
          </MyText>
        </View>
        <View>
          <MyText type="commonText" style={styles.description}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industryLorem Ipsum has beenLorem
          </MyText>
        </View>
        <MyTextInput
          customStyle={styles.input}
          labelText="Enter a Password"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
          disableCancel
        />
        <MyTextInput
          customStyle={styles.input}
          labelText="Re-enter a Password"
          secureTextEntry
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          disableCancel
        />
        <CustomButton style={styles.button} type="inactivePrimary">
          Create
        </CustomButton>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EnterPassword;
