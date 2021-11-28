import React, { useContext, useState, useCallback, useRef } from 'react';
import { View, ViewStyle } from 'react-native';
import {
  DraxProvider,
  DraxView,
  DraxViewDragStatus,
  DraxRenderContentProps,
  DraxDragWithReceiverEventData,
} from 'react-native-drax';

import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';

import styles from './styles';

type Props = {
  seedPhrase: string;
  customStyle?: ViewStyle;
  puzzleProgress: PuzzleStatus;
  setPuzzleProgress: React.Dispatch<React.SetStateAction<PuzzleStatus>>;
};

type WordPillProps = {
  wordItem: WordItemType;
  shape: PillShape;
};

type WordItemType = {
  word: string;
  order: string;
};

export enum PuzzleStatus {
  Incomplete = 'Incomplete',
  Right = 'Right',
  Wrong = 'Wrong',
}

enum PillShape {
  SourceOriginal = 'SourceOriginal',
  SourceSelected = 'SourceSelected',
  Invisible = 'Invisible',
  DestinationOriginal = 'DestinationOriginal',
  DestinationHoverOver = 'DestinationHoverOver',
  DestinationSolved = 'DestinationSolved',
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

const evaluateResult = (
  userSolution: Array<WordItemType | undefined>,
  rightSolution: Array<WordItemType>,
) => {
  for (let i = 0; i < 3; i++) {
    if (userSolution[i]?.order !== rightSolution[i].order) {
      return PuzzleStatus.Wrong;
    }
  }
  return PuzzleStatus.Right;
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
  const solvedCount = useRef(0);

  const { sourceRandomWords, destinationRandomWords } = generateRandomWords();

  console.log('destinationRandomWords', destinationRandomWords);

  const WordPill = ({ wordItem, shape }: WordPillProps) => {
    let wordText, wordColor, borderColor, backgroundColor;
    switch (shape) {
      case PillShape.SourceOriginal:
        wordText = wordItem.word;
        wordColor = colors.primary100;
        borderColor = colors.primary20;
        backgroundColor = colors.primary10;
        break;
      case PillShape.SourceSelected:
        wordText = wordItem.word;
        wordColor = colors.primary100;
        borderColor = colors.primary100;
        backgroundColor = colors.primary10;
        break;
      case PillShape.DestinationOriginal:
        wordText = wordItem.order;
        wordColor = colors.primary20;
        borderColor = colors.primary20;
        backgroundColor = colors.white;
        break;
      case PillShape.DestinationHoverOver:
        wordText = wordItem.order;
        wordColor = colors.primary20;
        borderColor = colors.primary100;
        backgroundColor = colors.white;
        break;
      case PillShape.DestinationSolved:
        wordText = wordItem.word;
        if (puzzleProgress === PuzzleStatus.Incomplete) {
          wordColor = colors.primary100;
          borderColor = colors.primary100;
          backgroundColor = colors.primary5;
        } else if (puzzleProgress === PuzzleStatus.Right) {
          wordColor = colors.confirm100;
          borderColor = colors.confirm100;
          backgroundColor = colors.confirm10;
        } else {
          wordColor = colors.failed100;
          borderColor = colors.failed100;
          backgroundColor = colors.failed10;
        }
        break;
      default:
        // PillShape.Invisible
        return null;
    }

    return (
      <View
        style={[
          styles.pill,
          {
            borderColor,
            backgroundColor,
          },
        ]}>
        <Typography type="smallTitleR" style={{ color: wordColor }}>
          {wordText}
        </Typography>
      </View>
    );
  };

  const destinationRenderContentHandler = (
    idx: number,
    wordItem: WordItemType,
    { viewState }: DraxRenderContentProps,
  ) => {
    if (
      (viewState?.dragStatus === DraxViewDragStatus.Dragging ||
        viewState?.dragStatus === DraxViewDragStatus.Released) &&
      destinationResult[idx]
    ) {
      return <WordPill wordItem={wordItem} shape={PillShape.Invisible} />;
    }
    if (destinationResult[idx]) {
      return (
        <WordPill
          wordItem={destinationResult[idx]}
          shape={PillShape.DestinationSolved}
        />
      );
    }

    if (viewState?.receivingDrag?.payload.order) {
      const incomingIsAssigned = destinationResult.find(
        dWord =>
          dWord && dWord.order === viewState?.receivingDrag?.payload.order,
      )!!;
      if (!incomingIsAssigned) {
        return (
          <WordPill
            wordItem={wordItem}
            shape={PillShape.DestinationHoverOver}
          />
        );
      }
    }

    return (
      <WordPill wordItem={wordItem} shape={PillShape.DestinationOriginal} />
    );
  };

  const destinationRenderHoverContentHandler = (
    idx: number,
    wordItem: WordItemType,
  ) => {
    if (destinationResult[idx]) {
      return (
        <WordPill
          wordItem={destinationResult[idx]}
          shape={PillShape.DestinationSolved}
        />
      );
    }
    return <WordPill wordItem={wordItem} shape={PillShape.Invisible} />;
  };

  const destinationOnReceiveDragDrop = (
    idx: number,
    event: DraxDragWithReceiverEventData,
  ) => {
    if (destinationResult[idx]) {
      return;
    }

    const incomingIsAssigned = destinationResult.find(
      dWord => dWord && dWord.order === event.dragged.payload.order,
    )!!;
    if (incomingIsAssigned) {
      return;
    }
    setDestinationResult(prevState => {
      if (event.dragged.payload.wordItem) {
        prevState[idx] = prevState[event.dragged.payload.idx];
        prevState[event.dragged.payload.idx] = undefined;
      } else {
        prevState[idx] = event.dragged.payload;
      }
      return prevState;
    });
  };

  if (puzzleProgress === PuzzleStatus.Incomplete) {
    return (
      <View style={[styles.draxWrapper, customStyle]}>
        <DraxProvider>
          <View style={[styles.container]}>
            <View style={styles.pillsContainer}>
              {destinationRandomWords.map((wordItem, idx) => {
                return (
                  <DraxView
                    key={wordItem.order}
                    draggable={true}
                    payload={{ wordItem, idx }}
                    renderContent={destinationRenderContentHandler.bind(
                      this,
                      idx,
                      wordItem,
                    )}
                    renderHoverContent={destinationRenderHoverContentHandler.bind(
                      this,
                      idx,
                      wordItem,
                    )}
                    style={styles.pillWrapper}
                    onReceiveDragDrop={destinationOnReceiveDragDrop.bind(
                      this,
                      idx,
                    )}
                  />
                );
              })}
            </View>
            <View style={styles.pillsContainer}>
              {sourceRandomWords.map(wordItem => {
                let isPlaced = false;
                return (
                  <DraxView
                    key={wordItem.word}
                    payload={wordItem}
                    draggable
                    renderContent={({ viewState }) => {
                      if (
                        viewState?.dragStatus === DraxViewDragStatus.Dragging ||
                        isPlaced
                      ) {
                        return (
                          <WordPill
                            wordItem={wordItem}
                            shape={PillShape.Invisible}
                          />
                        );
                      }

                      return (
                        <WordPill
                          wordItem={wordItem}
                          shape={PillShape.SourceOriginal}
                        />
                      );
                    }}
                    renderHoverContent={({ viewState }) => {
                      if (
                        viewState.dragStatus === DraxViewDragStatus.Released ||
                        isPlaced
                      ) {
                        return (
                          <WordPill
                            wordItem={wordItem}
                            shape={PillShape.Invisible}
                          />
                        );
                      }
                      return (
                        <WordPill
                          wordItem={wordItem}
                          shape={PillShape.SourceSelected}
                        />
                      );
                    }}
                    style={styles.pillWrapper}
                    onDragDrop={({ receiver }) => {
                      const recieverIsDestination = !!receiver.payload.wordItem;
                      if (recieverIsDestination) {
                        isPlaced = true;
                        solvedCount.current = solvedCount.current + 1;
                        if (solvedCount.current === 4) {
                          setPuzzleProgress(
                            evaluateResult(
                              destinationResult,
                              destinationRandomWords,
                            ),
                          );
                        }
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
  }

  return (
    <View style={[styles.container, customStyle]}>
      <View style={styles.pillsContainer}>
        {destinationResult.map(wordItem => (
          <View style={styles.pillWrapper}>
            <WordPill
              wordItem={wordItem}
              shape={PillShape.DestinationSolved}
              key={wordItem.order}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

export default DragAndDrop;
