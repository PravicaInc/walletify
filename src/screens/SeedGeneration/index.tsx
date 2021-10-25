import React, { useContext, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';

import CustomButton from '../../components/shared/CustomButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { MyText } from '../../components/shared/myText';
import ProgressBar from '../../components/ProgressBar';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';

import { ThemeContext } from '../../contexts/theme';
import seedPhrase from '../../data/seedPhrase';
import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';

enum Stage {
  Blurred = 'Blurred',
  ToCopy = 'ToCopy',
  ToConfirm = 'ToConfirm',
}

const SeedGeneration: React.FC = () => {
  const { dispatch } = useNavigation();

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [currentStage, setCurrentStage] = useState<Stage>(Stage.Blurred);

  const handleView = () => setCurrentStage(Stage.ToCopy);

  const handleCopy = () => {
    Clipboard.setString(seedPhrase);
    setCurrentStage(Stage.ToConfirm);
  };

  const handleConfirm = () =>
    dispatch(
      StackActions.push('CreatePassword', {
        progressBar: { finished: 2, total: 2 },
      }),
    );

  const handleGoBack = () => dispatch(StackActions.pop());

  let BottomButton = (
    <CustomButton type="activePrimary" onPress={handleView}>
      View Seed Phrase
    </CustomButton>
  );

  if (currentStage === Stage.ToCopy)
    BottomButton = (
      <CustomButton type="activePrimary" onPress={handleCopy}>
        Copy Seed Phrase
      </CustomButton>
    );

  if (currentStage === Stage.ToConfirm)
    BottomButton = (
      <CustomButton type="activePrimary" onPress={handleConfirm}>
        Continue
      </CustomButton>
    );

  const containerStyle = [styles.container, { backgroundColor: colors.white }];

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentContainer}>
          <View>
            <CustomAppHeader
              noBackText={false}
              handleGoBack={handleGoBack}
              containerStyle={styles.header}
              backColor={colors.primary100}
            />
            <ProgressBar finished={1} total={2} />
          </View>
          <View style={styles.topContent}>
            <LockedShield />
            <MyText type="bigTitle" style={styles.title}>
              Your Seed Phrase
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
            <SeedPhraseGrid
              phrase={seedPhrase}
              isBlurred={currentStage === Stage.Blurred}
            />
          </View>

          {BottomButton}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SeedGeneration;
