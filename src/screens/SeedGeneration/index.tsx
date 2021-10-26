import React, { useContext, useState, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';

import GeneralButton from '../../components/shared/GeneralButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';

import { ThemeContext } from '../../contexts/theme';
import seedPhrase from '../../data/seedPhrase';
import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';
import { useStores } from "../../hooks/useStores";
import {generateSecretKey} from "@stacks/wallet-sdk"
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/types";

enum Stage {
  Blurred = 'Blurred',
  ToCopy = 'ToCopy',
  ToConfirm = 'ToConfirm',
}

type Props = NativeStackScreenProps<RootStackParamList, 'SeedGeneration'>;

const SeedGeneration: React.FC<Props> = (props) => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.Blurred);
const [seedPhrase, setSeedPhrase]= useState(generateSecretKey(256))



  const handleView = () => setCurrentStage(Stage.ToCopy);

  const handleCopy = () => {
    Clipboard.setString(seedPhrase);
    setCurrentStage(Stage.ToConfirm);
  };

  const handleConfirm = () =>
    dispatch(
      StackActions.push('CreatePassword', {
        progressBar: { finished: 1, total: 2 },
        seed: seedPhrase,
      }),
    );

  const handleGoBack = () => dispatch(StackActions.pop());

  let BottomButton = (
    <GeneralButton type="activePrimary" onPress={handleView}>
      View Seed Phrase
    </GeneralButton>
  );

  if (currentStage === Stage.ToCopy)
    BottomButton = (
      <GeneralButton type="activePrimary" onPress={handleCopy}>
        Copy Seed Phrase
      </GeneralButton>
    );

  if (currentStage === Stage.ToConfirm)
    BottomButton = (
      <GeneralButton type="activePrimary" onPress={handleConfirm}>
        Continue
      </GeneralButton>
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
            <ProgressBar finished={2} total={2} />
          </View>
          <View style={styles.topContent}>
            <LockedShield />
            <Typography type="bigTitle" style={styles.title}>
              Your Seed Phrase
            </Typography>
            <Typography type="commonText" style={styles.description}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industryLorem Ipsum has beenLorem
            </Typography>
          </View>

          <View style={styles.bottomContent}>
            <Typography type="commonTextBold" style={styles.seedTitle}>
              Your Seed Phrase:
            </Typography>
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
