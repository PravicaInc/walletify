import React, { useContext, useMemo } from 'react';
import { View } from 'react-native';
import { DraxView } from 'react-native-drax';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';
import { PuzzleItem } from '../../shared/types';
import { ordinalSuffixOf, shuffleArray } from '../../shared/helpers';

type Props = {
  isCompleted: boolean;
  isValid: boolean;
  chosenPuzzle: PuzzleItem<string>[];
  puzzleState: PuzzleItem<string>[];
  setPuzzleState: React.Dispatch<React.SetStateAction<PuzzleItem<string>[]>>;
};

const DragAndDrop: React.FC<Props> = ({
  setPuzzleState,
  puzzleState,
  chosenPuzzle,
  isCompleted,
  isValid,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const shuffledPuzzleSources = useMemo(
    () => shuffleArray(chosenPuzzle).map(item => item.index),
    [chosenPuzzle],
  );
  const shuffledPuzzleDestinations = useMemo(
    () => shuffleArray(chosenPuzzle).map(item => item.value),
    [chosenPuzzle],
  );

  return (
    <>
      <View style={styles.receivingZone}>
        {shuffledPuzzleSources.map(puzzleItemIndex => {
          const filledContent = puzzleState.find(
            item => item.index === puzzleItemIndex,
          );
          return (
            <View style={styles.puzzleItemWrapper}>
              <DraxView
                style={[
                  styles.puzzleItem,
                  {
                    backgroundColor: isCompleted
                      ? isValid
                        ? colors.confirm10
                        : colors.failed10
                      : filledContent
                      ? colors.cardsColor
                      : colors.defaultBlack,
                    borderColor: isCompleted
                      ? isValid
                        ? colors.confirm100
                        : colors.failed100
                      : filledContent
                      ? colors.cardsColor
                      : colors.deactiveState,
                  },
                ]}
                receivingStyle={{ borderColor: colors.primary100 }}
                draggable={false}
                onReceiveDragDrop={event => {
                  if (!filledContent) {
                    setPuzzleState(prevState => [
                      ...prevState,
                      {
                        value: event.dragged.payload || '?',
                        index: puzzleItemIndex,
                      },
                    ]);
                  }
                }}>
                <Typography
                  style={{
                    color: isCompleted
                      ? isValid
                        ? colors.confirm100
                        : colors.failed100
                      : filledContent
                      ? colors.white
                      : colors.deactiveState,
                  }}
                  type={'smallTitle'}>
                  {filledContent?.value ||
                    `${ordinalSuffixOf(puzzleItemIndex)} Word`}
                </Typography>
              </DraxView>
            </View>
          );
        })}
      </View>
      <View style={styles.receivingZone}>
        {shuffledPuzzleDestinations.map(puzzleItemValue => {
          const filledContent = puzzleState.find(
            item => item.value === puzzleItemValue,
          );
          return (
            <View style={styles.puzzleItemWrapper}>
              <DraxView
                style={[
                  styles.puzzleItem,
                  {
                    backgroundColor: colors.cardsColor,
                    borderColor: colors.primary20,
                    opacity: filledContent ? 0 : 1,
                  },
                ]}
                draggingStyle={styles.hidden}
                dragReleasedStyle={styles.hidden}
                hoverDraggingStyle={{ borderColor: colors.primary100 }}
                dragPayload={puzzleItemValue}
                draggable={!filledContent}>
                <Typography
                  style={{
                    color: colors.white,
                  }}
                  type={'smallTitleR'}>
                  {puzzleItemValue}
                </Typography>
              </DraxView>
            </View>
          );
        })}
      </View>
    </>
  );
};

export default DragAndDrop;
