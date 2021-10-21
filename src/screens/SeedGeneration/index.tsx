import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';

import CustomButton from '../../components/shared/CustomButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { MyText } from '../../components/shared/myText';
import ProgressBar from '../../components/ProgressBar';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';

import { ThemeContext } from '../../contexts/theme';
import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';

const seedPhrase = [
  'Brawl',
  'Cell',
  'Block',
  'Andre',
  'Daybreak',
  'Double',
  'Play',
  'Manchi',
  'Down',
  'to',
  'Earth',
  'Doorman',
  'Uncredited',
  'Driving',
  'While',
  'Black',
  'Malik',
  'Emancipation',
  'Cailloux',
  'Filming',
  'Fight',
  'Your',
  'Way',
  'Out',
];

const SeedGeneration: React.FC = () => {
  const { dispatch } = useNavigation();

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [isBlurred, setIsBlurred] = useState(true);

  const handleConfirm = () => dispatch(StackActions.push('EnterPassword'));

  const handleGoBack = () => dispatch(StackActions.pop());

  const BottomButton = isBlurred ? (
    <CustomButton type="activePrimary" onPress={() => setIsBlurred(false)}>
      View Seed Phrase
    </CustomButton>
  ) : (
    <CustomButton type="activePrimary" onPress={handleConfirm}>
      Continue
    </CustomButton>
  );

  const containerStyle = [styles.container, { backgroundColor: colors.white }];

  return (
    <SafeAreaView style={containerStyle}>
      <CustomAppHeader
        noBackText={false}
        handleGoBack={handleGoBack}
        containerStyle={{ shadowOpacity: 0 }}
        backColor={colors.primary100}
      />
      <View style={styles.contentContainer}>
        <ProgressBar finished={1} total={2} />
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
          <SeedPhraseGrid phrase={seedPhrase} isBlurred={isBlurred} />
        </View>

        {BottomButton}
      </View>
    </SafeAreaView>
  );
};

export default SeedGeneration;
