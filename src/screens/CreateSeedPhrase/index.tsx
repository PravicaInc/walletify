import React, {
  useContext,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { generateSecretKey } from '@stacks/wallet-sdk';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import WarningIcon from '../../assets/images/note-icon.svg';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';
import { ThemeContext } from '../../contexts/Theme/theme';
import LockedShield from '../../assets/locked-shield.svg';
import RevealEye from '../../assets/reveal-eye.svg';
import { RootStackParamList } from '../../navigation/types';
import styles from './styles';
import { OptionsPick } from '../../components/OptionsPick';
import GeneralButton from '../../components/shared/GeneralButton';
import { isIosApp } from '../../shared/helpers';

enum ScreenShape {
  Blurred = 'Blurred',
  ToConfirm = 'ToConfirm',
}

type Props = NativeStackScreenProps<RootStackParamList, 'CreateSeedPhrase'>;

const CreateSeedPhrase: React.FC<Props> = ({
  route: {
    params: { password },
  },
}) => {
  const confirmModalRef = useRef<BottomSheetModal>(null);
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const generatedSeedPhrase = useMemo(() => generateSecretKey(256), []);

  const [currentShape, setCurrentShape] = useState<ScreenShape>(
    ScreenShape.Blurred,
  );

  const handleView = useCallback(
    () => setCurrentShape(ScreenShape.ToConfirm),
    [],
  );

  const handleConfirm = useCallback(() => {
    confirmModalRef.current?.collapse();
    dispatch(
      StackActions.push('ConfirmSeedPhrase', {
        seedPhrase: generatedSeedPhrase,
        password,
      }),
    );
  }, [generatedSeedPhrase, password]);

  const handleGoBack = useCallback(() => dispatch(StackActions.pop()), []);

  const handlePressConfirm = useCallback(() => {
    confirmModalRef.current?.snapToIndex(0);
  }, []);

  const options = useMemo(() => {
    return [
      {
        label: "I've backed up my Secret Key",
        onClick: handleConfirm,
      },
    ];
  }, [handleConfirm]);

  const ctaButton = (
    <GeneralButton
      loading={false}
      canGoNext
      onClick={handlePressConfirm}
      text={'Continue'}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        containerStyles={styles.header}
        leftComponent={
          <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
        }
        rightComponent={
          currentShape !== ScreenShape.Blurred && isIosApp && ctaButton
        }
      />
      <ProgressBar currentBarIdx={2} total={3} customStyle={styles.progress} />
      <View style={styles.contentContainer}>
        <LockedShield />
        <Typography type="bigTitle" style={styles.title}>
          Your Secret Key
        </Typography>
        <Typography
          type="commonText"
          style={[styles.description, { color: colors.primary60 }]}>
          {currentShape === ScreenShape.Blurred
            ? 'NEVER share or show your Secret Key.\n Keep it private and safe!'
            : 'Write it down, copy it, save it, or even memorize it. Just make sure your Seed Phrase is safe and accessible.'}
        </Typography>
        <SeedPhraseGrid
          phrase={generatedSeedPhrase}
          isBlurred={currentShape === ScreenShape.Blurred}>
          {currentShape === ScreenShape.Blurred && (
            <TouchableOpacity onPress={handleView} style={styles.reveal}>
              <RevealEye style={styles.smallSpace} />
              <Typography
                type="buttonText"
                style={[styles.smallSpace, { color: colors.secondary100 }]}>
                View Seed Phrase
              </Typography>
            </TouchableOpacity>
          )}
        </SeedPhraseGrid>
        <OptionsPick
          options={options}
          userIcon={
            <WarningIcon
              fill={colors.warning100}
              fillOpacity={0.1}
              stroke={colors.warning100}
              width={80}
              height={80}
            />
          }
          title="Backed up your Secret Key?"
          subTitle="You have to back up your Secret Key in safe place, theres NOTHING we can do if somebody finds it."
          ref={confirmModalRef}
        />
        {!isIosApp && currentShape !== ScreenShape.Blurred && ctaButton}
      </View>
    </SafeAreaView>
  );
};

export default CreateSeedPhrase;
