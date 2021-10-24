import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import CustomButton from '../../components/shared/CustomButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { MyText } from '../../components/shared/myText';
import ProgressBar from '../../components/ProgressBar';
import { MyTextInput } from '../../components/shared/MyTextInput';
import { ThemeContext } from '../../contexts/theme';
import PasswordShield from '../../assets/password-shield.svg';
import styles from './styles';
import { validatePassword } from '../../components/shared/MyTextInput/validate-password';
import { RootStackParamList } from '../routes';

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

const CreatePassword = (props: Props) => {
  const { dispatch } = useNavigation();

  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const progressBar = props.route.params?.progressBar;

  const {
    theme: { colors },
  } = useContext(ThemeContext);
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
        const {
          meetsAllStrengthRequirements,
          meetsLengthRequirement,
          meetsScoreRequirement,
          score,
        } = validatePassword(password);
        console.log('score', score);
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

  const handleGoBack = () => dispatch(StackActions.pop());

  const isValidInput =
    confirmPassword === password &&
    strengthResult?.textResult &&
    ['Netural', 'Powerful'].includes(strengthResult?.textResult);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      {progressBar && (
        <ProgressBar
          finished={progressBar.finished}
          total={progressBar.total}
          customStyle={styles.progressBar}
        />
      )}
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
            <PasswordShield />
            <View>
              <MyText type="bigTitle" style={styles.title}>
                Create Your Password
              </MyText>
            </View>
            <View>
              <MyText type="commonText" style={styles.description}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industryLorem Ipsum has beenLorem
              </MyText>
            </View>

            <MyTextInput
              customStyle={[styles.input, { marginBottom: 0 }]}
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
                <MyText
                  type="smallText"
                  style={{
                    color: strengthResult?.barsColor,
                  }}>{` ${strengthResult?.textResult}`}</MyText>
              </View>
            )}
            <View style={styles.bottomInput}>
              <MyTextInput
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
            <CustomButton
              style={styles.button}
              type={isValidInput ? 'activePrimary' : 'inactivePrimary'}>
              Create
            </CustomButton>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePassword;
