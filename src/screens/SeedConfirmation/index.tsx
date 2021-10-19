import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';

import CustomButton from '../../components/shared/CustomButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { MyText } from '../../components/shared/myText';
import ProgressBar from '../../components/ProgressBar';

import { ThemeContext } from '../../contexts/theme';
import LockedShield from '../../assets/locked-shield.svg';

import styles from './styles';

const SeedConfirmation: React.FC = () => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const handleConfirm = () => dispatch(StackActions.push('EnterPassword'));

  const handleGoBack = () => dispatch(StackActions.pop());

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.contrast },
  ];

  return (
    <SafeAreaView style={containerStyle}>
      <CustomAppHeader
        title=""
        noBackText={false}
        handleGoBack={handleGoBack}
        containerStyle={{ backgroundColor: 'transparent' }}
      />
      <View style={styles.contentContainer}>
        <ProgressBar finished={2} total={3} />
        <LockedShield />
        <MyText type="bigTitle">Seed Confirmation</MyText>
        <CustomButton type="activePrimary" onPress={handleConfirm}>
          Continue
        </CustomButton>
      </View>
    </SafeAreaView>
  );
};

export default SeedConfirmation;
