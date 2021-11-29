import React, { useContext, useState, useRef, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { generateSecretKey } from '@stacks/wallet-sdk';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import ConfirmModal from '../../components/ConfirmModal';
import GeneralButton from '../../components/shared/GeneralButton';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';
import { ThemeContext } from '../../contexts/Theme/theme';
import LockedShield from '../../assets/locked-shield.svg';
import { RootStackParamList } from '../../navigation/types';
import styles from './styles';

enum ScreenShape {
  Blurred = 'Blurred',
  ToConfirm = 'ToConfirm',
  Display = 'Display',
}

const generatedSeedPhrase = generateSecretKey(256);

type Props = NativeStackScreenProps<RootStackParamList, 'ShowSeedPhrase'>;

const ShowSeedPhrase: React.FC<Props> = props => {
  const confirmModalRef = useRef<BottomSheetModal>(null);

  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const password = props.route.params?.password || '';
  const currentSeedPhrase = props.route.params?.seedPhrase || '';

  const [currentShape, setCurrentShape] = useState<ScreenShape>(
    currentSeedPhrase ? ScreenShape.Display : ScreenShape.Blurred,
  );

  const handleView = () => setCurrentShape(ScreenShape.ToConfirm);

  const handleConfirm = () => {
    confirmModalRef.current?.dismiss();
    dispatch(
      StackActions.push('ConfirmSeedPhrase', {
        seedPhrase: generatedSeedPhrase,
        password,
      }),
    );
  };

  const handleGoBack = () => dispatch(StackActions.pop());

  const handlePresenConfirm = useCallback(() => {
    confirmModalRef.current?.present();
  }, []);

  const confirmContinue = useCallback(
    () => (
      <Typography type="buttonText" style={{ color: colors.secondary100 }}>
        I've backed up my Secret Key
      </Typography>
    ),
    [colors.secondary100],
  );

  const confirmAbort = useCallback(
    () => (
      <Typography type="smallTitle" style={{ color: colors.secondary100 }}>
        Let me back it up
      </Typography>
    ),
    [colors.secondary100],
  );

  const rightComponent = useCallback(
    () => (
      <TouchableOpacity
        style={styles.confirmContainer}
        onPress={handlePresenConfirm}
        disabled={currentShape !== ScreenShape.ToConfirm}>
        <Typography
          type="buttonText"
          style={[
            {
              color:
                currentShape !== ScreenShape.ToConfirm
                  ? colors.primary40
                  : colors.secondary100,
            },
          ]}>
          Confirm
        </Typography>
      </TouchableOpacity>
    ),
    [colors.primary40, colors.secondary100, currentShape, handlePresenConfirm],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.contentContainer}>
          <Header
            leftComponent={
              <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
            }
            rightComponent={
              currentShape !== ScreenShape.Display && rightComponent
            }
          />
          {currentShape !== ScreenShape.Display && (
            <ProgressBar
              currentBarIdx={2}
              total={3}
              customStyle={styles.progress}
            />
          )}
          <View style={styles.topContent}>
            <LockedShield />
            <Typography type="bigTitle" style={styles.title}>
              {currentShape !== ScreenShape.Display
                ? 'Your Secret Key'
                : 'Your Seed Phrase'}
            </Typography>
            <Typography
              type="commonText"
              style={[styles.description, { color: colors.primary60 }]}>
              {currentShape === ScreenShape.Blurred
                ? 'NEVER share or show your Secret Key. Keep it private and safe!'
                : 'Write it down, copy it, save it, or even memorize it. Just make sure your Seed Phrase is safe and accessible.'}
            </Typography>
          </View>

          <View style={styles.bottomContent}>
            <Typography type="commonTextBold" style={styles.seedTitle}>
              Your Seed Phrase:
            </Typography>
            <SeedPhraseGrid
              phrase={
                currentShape === ScreenShape.Display
                  ? currentSeedPhrase
                  : generatedSeedPhrase
              }
              isBlurred={currentShape === ScreenShape.Blurred}
            />
          </View>
          {currentShape === ScreenShape.Blurred && (
            <GeneralButton type={'activePrimary'} onPress={handleView}>
              View Seed Phrase
            </GeneralButton>
          )}
          <ConfirmModal
            ref={confirmModalRef}
            handleNextAction={handleConfirm}
            title="Backed up your Secret Key?"
            description="You have to back up your Secret Key in safe place, there's NOTHING we can do if somebody finds it."
            renderContinueText={confirmContinue}
            renderAbortText={confirmAbort}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShowSeedPhrase;
