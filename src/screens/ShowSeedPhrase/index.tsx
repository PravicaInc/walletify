import React, { useContext, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import GeneralButton from '../../components/shared/GeneralButton';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
// import ProgressBar from '../../components/ProgressBar';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';

import { ThemeContext } from '../../contexts/Theme/theme';

import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';
import { generateSecretKey } from '@stacks/wallet-sdk';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

enum Stage {
  Blurred = 'Blurred',
  ToCopy = 'ToCopy',
  ToConfirm = 'ToConfirm',
  Display = 'Display',
}

const generatedSeedPhrase = generateSecretKey(256);

type Props = NativeStackScreenProps<RootStackParamList, 'ShowSeedPhrase'>;

const ShowSeedPhrase: React.FC<Props> = props => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const password = props.route.params?.password || '';
  const currentSeedPhrase = props.route.params?.seedPhrase || '';

  const [currentStage, setCurrentStage] = useState<Stage>(
    currentSeedPhrase ? Stage.Display : Stage.Blurred,
  );

  const [isLoading, setIsloading] = useState(false);

  const handleView = () => setCurrentStage(Stage.ToCopy);

  const handleCopyGeneratedPhrase = () => {
    Clipboard.setString(generatedSeedPhrase);
    setCurrentStage(Stage.ToConfirm);
  };

  const handleCopyCurrentPhrase = () => {
    Clipboard.setString(currentSeedPhrase);
  };

  const handleConfirm = async () => {
    setIsloading(true);
    dispatch(
      StackActions.replace('Home', {
        seedPhrase: generatedSeedPhrase,
        password,
      }),
    );
  };

  const handleGoBack = () => dispatch(StackActions.pop());

  let BottomButton = (
    <GeneralButton
      type={isLoading ? 'inactivePrimary' : 'activePrimary'}
      onPress={handleView}>
      View Seed Phrase
    </GeneralButton>
  );

  if (currentStage === Stage.ToCopy) {
    BottomButton = (
      <GeneralButton
        type={isLoading ? 'inactivePrimary' : 'activePrimary'}
        onPress={handleCopyGeneratedPhrase}>
        Copy Seed Phrase
      </GeneralButton>
    );
  }

  if (currentStage === Stage.Display) {
    BottomButton = (
      <GeneralButton
        type={isLoading ? 'inactivePrimary' : 'activePrimary'}
        onPress={handleCopyCurrentPhrase}>
        Copy Seed Phrase
      </GeneralButton>
    );
  }

  if (currentStage === Stage.ToConfirm) {
    BottomButton = (
      <GeneralButton
        type={isLoading ? 'inactivePrimary' : 'activePrimary'}
        onPress={handleConfirm}>
        Continue
      </GeneralButton>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentContainer}>
          <Header
            leftComponent={
              <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
            }
          />
          {/* <ProgressBar finished={2} total={3} /> */}

          <View style={styles.topContent}>
            <LockedShield />
            <Typography type="bigTitle" style={styles.title}>
              Your Seed Phrase
            </Typography>
            <Typography
              type="commonText"
              style={[styles.description, { color: colors.primary60 }]}>
              Write it down, copy it, save it, or even memorize it. Just make
              sure your Seed Phrase is safe and accessible.
            </Typography>
          </View>

          <View style={styles.bottomContent}>
            <Typography type="commonTextBold" style={styles.seedTitle}>
              Your Seed Phrase:
            </Typography>
            <SeedPhraseGrid
              phrase={
                currentStage === Stage.Display
                  ? currentSeedPhrase
                  : generatedSeedPhrase
              }
              isBlurred={currentStage === Stage.Blurred}
            />
          </View>

          {BottomButton}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShowSeedPhrase;
