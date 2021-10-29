import React, { useContext } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { observer } from 'mobx-react-lite';
import GeneralButton from '../../components/shared/GeneralButton';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { Typography } from '../../components/shared/Typography';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';

import { ThemeContext } from '../../contexts/theme';

import LockedShield from '../../assets/locked-shield.svg';
import styles from './styles';

import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'ShowSeedPhrase'>;

const ShowSeedPhrase: React.FC<Props> = observer(props => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const containerStyle = [styles.container, { backgroundColor: colors.white }];
  const descriptionStyle = [styles.description, { color: colors.primary60 }];

  const seedPhrase = props.route.params?.seedPhrase;

  const handleCopy = () => {
    if (seedPhrase) {
      Clipboard.setString(seedPhrase);
    }
  };

  const handleView = () =>
    dispatch(
      StackActions.replace('EnterPassword', { nextScreen: 'ShowSeedPhrase' }),
    );

  const handleGoBack = () => dispatch(StackActions.replace('Settings'));

  // top content
  const titleText = seedPhrase
    ? 'Your Seed Phrase'
    : 'Recover Your Seed Phrase';
  const descriptionText = seedPhrase ? (
    <>
      <Typography type="commonText" style={descriptionStyle}>
        Write it down, copy it, save it, or even memorize it.
      </Typography>
      <Typography type="commonText" style={descriptionStyle}>
        Write it down, copy it, save it, or even memorize it. Just make sure
        your Seed Phrase is safe and accessible.
      </Typography>
    </>
  ) : (
    <Typography type="commonText" style={descriptionStyle}>
      This feature allows you to recover your seed phrase in case you need it.
    </Typography>
  );

  // seed phrase display
  const seedPhraseDisplay = seedPhrase ? (
    <>
      <Typography type="commonTextBold" style={styles.seedTitle}>
        Your Seed Phrase:
      </Typography>

      <SeedPhraseGrid phrase={seedPhrase} isBlurred={false} />
    </>
  ) : null;

  // bottom button
  const actionText = seedPhrase ? 'Copy Seed Phrase' : 'View Seed Phrase';
  const handleAction = seedPhrase ? handleCopy : handleView;

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentContainer}>
          <CustomAppHeader
            noBackText={false}
            handleGoBack={handleGoBack}
            containerStyle={styles.header}
            backColor={colors.primary100}
          />
          <View style={styles.topContent}>
            <LockedShield />
            <Typography type="bigTitle" style={styles.title}>
              {titleText}
            </Typography>
            {descriptionText}
          </View>

          <View style={styles.bottomContent}>
            {seedPhraseDisplay}
            <GeneralButton
              type={'activePrimary'}
              onPress={handleAction}
              // style={styles.button}
            >
              {actionText}
            </GeneralButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default ShowSeedPhrase;
