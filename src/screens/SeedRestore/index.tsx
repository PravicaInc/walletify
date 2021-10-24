import React, { useContext, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';

import CustomButton from '../../components/shared/CustomButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { MyText } from '../../components/shared/myText';
import { MyTextInput } from '../../components/shared/MyTextInput';

import { ThemeContext } from '../../contexts/theme';
import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';

const SeedRestore: React.FC = () => {
  const { dispatch } = useNavigation();

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [seedPhrase, setSeedPhrase] = useState('');

  const handleContinue = () => dispatch(StackActions.push('CreatePassword'));

  const handleOldPassword = () =>
    dispatch(StackActions.push('OldPassword', { seedPhrase }));

  const handleGoBack = () => dispatch(StackActions.pop());

  let BottomButton = (
    <CustomButton type="inactivePrimary">Continue</CustomButton>
  );

  if (seedPhrase.length > 0)
    BottomButton = (
      <CustomButton
        type="activePrimary"
        onPress={
          seedPhrase === 'old seed phrase' ? handleOldPassword : handleContinue
        }>
        Continue
      </CustomButton>
    );

  const containerStyle = [styles.container, { backgroundColor: colors.white }];

  const inputStyle = [styles.seedInput, { backgroundColor: colors.card }];

  return (
    <SafeAreaView style={containerStyle}>
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
            <View style={styles.topContent}>
              <LockedShield />
              <MyText type="bigTitle" style={styles.title}>
                Enter Your Seed Phrase
              </MyText>
              <MyText type="commonText" style={styles.description}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industryLorem Ipsum has beenLorem
              </MyText>
            </View>

            <View style={styles.bottomContent}>
              <MyText type="commonTextBold" style={styles.seedTitle}>
                Your Seed Phrase:
              </MyText>
              <View style={styles.seedInputContainer}>
                <MyTextInput
                  value={seedPhrase}
                  customStyle={inputStyle}
                  onChangeText={setSeedPhrase}
                  disableCancel
                  multiline={true}
                  placeholder="Type Your Seed Phrase..."
                  placeholderTextColor={colors.primary20}
                  secureTextEntry={false}
                />
              </View>
            </View>

            {BottomButton}
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeedRestore;
