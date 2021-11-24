import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import { DraxProvider, DraxView, DraxViewDragStatus } from 'react-native-drax';

import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';

import styles from './styles';

export enum PuzzleStatus {
  Incomplete = 'Incomplete',
  Complete = 'Complete',
  Right = 'Right',
  Wrong = 'Wrong',
}

const concatSuffix = (num: number) => {
  if ([1, 21].includes(num)) {
    return `${num}st Word`;
  }
  if ([2, 22].includes(num)) {
    return `${num}nd Word`;
  }
  if ([3, 23].includes(num)) {
    return `${num}rd Word`;
  }
  return `${num}th Word`;
};

const shuffleArray = (arr: Array<any>) => {
  const shuffledArr = [...arr];
  let i = shuffledArr.length,
    j = 0,
    temp;
  while (i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = shuffledArr[i];
    shuffledArr[i] = shuffledArr[j];
    shuffledArr[j] = temp;
  }
  return shuffledArr;
};

const getRandomWords = (seedPhrase: string) => {
  const seedPhraseArr = seedPhrase.split(' ');
  const length = seedPhraseArr.length;

  const randomIdxArray = shuffleArray([...Array(length).keys()]);

  const sourceRandomWords = randomIdxArray.slice(0, 4).map(idx => ({
    order: concatSuffix(idx + 1),
    word: seedPhraseArr[idx],
  }));

  const destinationRandomWords = shuffleArray(sourceRandomWords);
  return { sourceRandomWords, destinationRandomWords };
};

type Props = {
  seedPhrase: string;
  customStyle?: ViewStyle;
  puzzleProgress: PuzzleStatus;
  setPuzzleProgress: React.Dispatch<React.SetStateAction<PuzzleStatus>>;
};

const DragAndDrop: React.FC<Props> = ({
  puzzleProgress,
  setPuzzleProgress,
  seedPhrase,
  customStyle,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const generateRandomWords = useCallback(() => {
    const randomWords = getRandomWords(seedPhrase);
    return randomWords;
  }, [seedPhrase]);

  const [destinationResult, setDestinationResult] = useState(
    Array.from(Array(4)),
  );

  useEffect(() => {
    console.log('destinationResult changed');
    console.log(destinationResult);
  }, [destinationResult]);

  const { sourceRandomWords, destinationRandomWords } = generateRandomWords();

  return (
    <View style={[styles.draxWrapper, customStyle]}>
      <DraxProvider>
        <View style={[styles.container]}>
          <View style={styles.pillsContainer}>
            {destinationRandomWords.map((wordItem, idx) => {
              return (
                <DraxView
                  draggable={true}
                  payload={{ wordItem, idx }}
                  renderContent={({ viewState }) => {
                    if (
                      viewState?.dragStatus === DraxViewDragStatus.Dragging &&
                      destinationResult[idx]
                    ) {
                      return null;
                    }
                    if (destinationResult[idx]) {
                      return (
                        <View
                          style={[
                            styles.pill,
                            {
                              borderColor: colors.primary100,
                              backgroundColor: colors.primary5,
                            },
                          ]}>
                          <Typography type="smallTitleR">
                            {destinationResult[idx].word}
                          </Typography>
                        </View>
                      );
                    }
                    const newLocal = viewState?.receivingDrag?.payload;
                    return (
                      <View
                        style={[
                          styles.pill,
                          {
                            borderColor:
                              viewState?.receiveStatus &&
                              typeof newLocal !== 'number'
                                ? colors.primary100
                                : colors.primary20,
                          },
                        ]}>
                        <Typography
                          type="smallTitleR"
                          style={{ color: colors.primary20 }}>
                          {wordItem.order}
                        </Typography>
                      </View>
                    );
                  }}
                  renderHoverContent={() => {
                    if (destinationResult[idx]) {
                      return (
                        <View
                          style={[
                            styles.pill,
                            {
                              borderColor: colors.primary100,
                              backgroundColor: colors.primary5,
                            },
                          ]}>
                          <Typography type="smallTitleR">
                            {destinationResult[idx].word}
                          </Typography>
                        </View>
                      );
                    }
                    return null;
                  }}
                  style={styles.pillWrapper}
                  onReceiveDragDrop={event => {
                    // check if the word isn't already assigned
                    if (!destinationResult[idx]) {
                      setDestinationResult(prevState => {
                        // check if the incoming word is from a destination
                        if (event.dragged.payload.wordItem) {
                          prevState[idx] = prevState[event.dragged.payload.idx];
                          prevState[event.dragged.payload.idx] = undefined;
                        } else {
                          prevState[idx] = event.dragged.payload;
                        }
                        return prevState;
                      });
                    }
                  }}
                />
              );
            })}
          </View>
          <View style={styles.pillsContainer}>
            {sourceRandomWords.map(wordItem => {
              let isPlaced = false;
              return (
                <DraxView
                  payload={wordItem}
                  draggable
                  renderContent={({ viewState }) => {
                    if (
                      viewState?.dragStatus !== DraxViewDragStatus.Inactive ||
                      isPlaced
                    ) {
                      return null;
                    }
                    return (
                      <View
                        style={[
                          styles.pill,
                          {
                            borderColor: colors.primary20,
                            backgroundColor: colors.primary10,
                          },
                        ]}>
                        <Typography type="smallTitleR">
                          {wordItem.word}
                        </Typography>
                      </View>
                    );
                  }}
                  renderHoverContent={({ viewState }) => {
                    if (
                      viewState.dragStatus === DraxViewDragStatus.Released &&
                      isPlaced
                    ) {
                      return null;
                    }
                    return (
                      <View
                        style={[
                          styles.pill,
                          {
                            borderColor: colors.primary100,
                            backgroundColor: colors.primary10,
                          },
                        ]}>
                        <Typography type="smallTitleR">
                          {wordItem.word}
                        </Typography>
                      </View>
                    );
                  }}
                  style={styles.pillWrapper}
                  key={wordItem.word}
                  onDragDrop={({ receiver }) => {
                    if (!destinationResult[receiver.payload.idx]) {
                      isPlaced = true;
                    }
                  }}
                />
              );
            })}
          </View>
        </View>
      </DraxProvider>
    </View>
  );
};

export default DragAndDrop;
