import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import DragAndDrop from '../../components/DragAndDrop';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import ProgressBar from '../../components/ProgressBar';
import { ThemeContext } from '../../contexts/Theme/theme';
import LockedShield from '../../assets/locked-shield.svg';
import { RootStackParamList } from '../../navigation/types';
import styles from './styles';
import { shuffleArrayWithIndex } from '../../shared/helpers';
import { PuzzleItem } from '../../shared/types';
import { DraxProvider } from 'react-native-drax';

type Props = NativeStackScreenProps<RootStackParamList, 'ConfirmSeedPhrase'>;

const ConfirmSeedPhrase: React.FC<Props> = ({
  route: {
    params: { password, seedPhrase },
  },
}) => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const [chosenPuzzle, setChosenPuzzle] = useState<PuzzleItem<string>[]>(() =>
    shuffleArrayWithIndex(seedPhrase.split(' ')).slice(0, 4),
  );

  const [puzzleState, setPuzzleState] = useState<PuzzleItem<string>[]>([]);
  const isCompleted = puzzleState.length === 4;
  const isValid = useMemo(
    () =>
      puzzleState.reduce((acc, item) => {
        return (
          acc &&
          item.index ===
            chosenPuzzle.filter(chosen => chosen.value === item.value)[0].index
        );
      }, isCompleted),
    [puzzleState, isCompleted],
  );

  const handleDone = useCallback(
    () =>
      dispatch(
        StackActions.replace('Home', {
          seedPhrase,
          password,
        }),
      ),
    [seedPhrase, password],
  );

  const handleGoBack = useCallback(() => dispatch(StackActions.pop()), []);
  const handleRetry = useCallback(() => {
    const shuffledArray = shuffleArrayWithIndex(seedPhrase.split(' ')).slice(
      0,
      4,
    );
    setChosenPuzzle(shuffledArray);
    setPuzzleState([]);
  }, [seedPhrase]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        containerStyles={styles.header}
        leftComponent={
          <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
        }
      />
      <ProgressBar currentBarIdx={3} total={3} customStyle={styles.progress} />
      <DraxProvider>
        <View style={styles.contentContainer}>
          <LockedShield />
          <Typography type="bigTitle" style={styles.title}>
            Confirm Secret Key
          </Typography>
          <Typography
            type="commonText"
            style={[styles.description, { color: colors.primary60 }]}>
            Just to make sure you backed up your Secret Key, give it a try to
            drag and drop the right word in its right place in your Secret Key.
          </Typography>
          <DragAndDrop
            isCompleted={isCompleted}
            isValid={isValid}
            chosenPuzzle={chosenPuzzle}
            puzzleState={puzzleState}
            setPuzzleState={setPuzzleState}
          />
          <TouchableOpacity
            onPress={isValid ? handleDone : handleRetry}
            disabled={!isCompleted}
            style={[
              styles.button,
              styles.pusher,
              {
                backgroundColor: !isCompleted
                  ? colors.primary20
                  : colors.primary100,
              },
            ]}>
            <Typography type="buttonText" style={{ color: colors.white }}>
              {isValid || !isCompleted ? 'Done' : 'Retry'}
            </Typography>
          </TouchableOpacity>
        </View>
      </DraxProvider>
    </SafeAreaView>
  );
};

export default ConfirmSeedPhrase;
