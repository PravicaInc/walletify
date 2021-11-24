import React, { useContext, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DragAndDrop from '../../components/DragAndDrop';
import GeneralButton from '../../components/shared/GeneralButton';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import { ThemeContext } from '../../contexts/Theme/theme';
import LockedShield from '../../assets/locked-shield.svg';
import { RootStackParamList } from '../../navigation/types';
import { PuzzleStatus } from '../../components/DragAndDrop';
import styles from './styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ShowSeedPhrase'>;

const SeedConfirmation: React.FC<Props> = props => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [puzzleProgress, setPuzzleProgress] = useState<PuzzleStatus>(
    PuzzleStatus.Incomplete,
  );

  const password = props.route.params?.password || '';
  const seedPhrase = props.route.params?.seedPhrase || '';

  const handleDone = () =>
    dispatch(
      StackActions.push('Home', {
        seedPhrase,
        password,
      }),
    );

  const handleGoBack = () => dispatch(StackActions.pop());

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentContainer}>
          <Header
            leftComponent={
              <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
            }
          />
          <ProgressBar
            currentBarIdx={3}
            total={3}
            customStyle={styles.progress}
          />
          <View style={styles.topContent}>
            <LockedShield />
            <Typography type="bigTitle" style={styles.title}>
              Confirm Secret Key
            </Typography>
            <Typography
              type="commonText"
              style={[styles.description, { color: colors.primary60 }]}>
              Just to make sure you backed up your Secret Key, give it a try to
              drag and drop the right word in its right place in your Secret
              Key.
            </Typography>
          </View>

          <View style={styles.bottomContent}>
            <DragAndDrop
              seedPhrase={seedPhrase}
              customStyle={styles.dragNDrop}
              puzzleProgress={puzzleProgress}
              setPuzzleProgress={setPuzzleProgress}
            />
          </View>

          <GeneralButton type={'inactivePrimary'} onPress={handleDone}>
            Continue
          </GeneralButton>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeedConfirmation;
