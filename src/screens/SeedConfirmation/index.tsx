import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';

import GeneralButton from '../../components/shared/GeneralButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';

import { ThemeContext } from '../../contexts/theme';
import LockedShield from '../../assets/locked-shield.svg';

import styles from './styles';

const SeedConfirmation: React.FC = () => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const handleConfirm = () =>
    dispatch(
      StackActions.push('CreatePassword', {
        progressBar: { finished: 2, total: 2 },
      }),
    );

  const handleGoBack = () => dispatch(StackActions.pop());

  const containerStyle = [styles.container, { backgroundColor: colors.white }];

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
        <Typography type="bigTitle">Seed Confirmation</Typography>
        <GeneralButton type="activePrimary" onPress={handleConfirm}>
          Continue
        </GeneralButton>
      </View>
    </SafeAreaView>
  );
};

export default SeedConfirmation;
