import React, { useContext, useEffect, useRef, useState } from 'react';
import { TextInput, View } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';

interface IProps {
  phrase?: string;
  setPhrase?: (val: string) => void;
  isBlurred?: boolean;
  isEditable?: boolean;
}

const SeedPhraseGrid: React.FC<IProps> = ({
  isBlurred,
  isEditable,
  phrase,
  setPhrase,
  children,
}) => {
  const {
    theme: { colors, fonts },
  } = useContext(ThemeContext);
  const phraseLength = isEditable
    ? 24
    : ((phrase || '')?.split(' ') || []).length;
  const [phraseState, setPhraseState] = useState<any[]>(
    new Array(phraseLength).fill(undefined).map((val, index) => {
      const parsedPhrase = phrase?.split(' ') || [];
      return parsedPhrase[index] || val;
    }),
  );
  const wordsRef = useRef<TextInput[]>([]);
  useEffect(() => {
    if (setPhrase) {
      setPhrase(phraseState.filter(word => !!word).join(' '));
    }
  }, [phraseState]);
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {phraseState.map((word, i) => {
        const handleChange = (text: string) => {
          if (text[text.length - 1] === ' ') {
            wordsRef.current[i + 1].focus();
          }
          const newValueArray = text.trim().split(' ');
          const inputToFocus = i + newValueArray.length;
          if (newValueArray.length > 1) {
            wordsRef.current[inputToFocus < 24 ? inputToFocus : 23].focus();
          }
          const start = i;
          const end = newValueArray.length;
          const prevPart = phraseState.slice(0, start);
          const endPart = phraseState.slice(start + end);
          setPhraseState(
            [...prevPart, ...newValueArray, ...endPart].slice(0, 24),
          );
        };
        return (
          <View
            style={[
              styles.word,
              i < phraseLength - 4 && {
                ...styles.bottomBorder,
                borderBottomColor: colors.primary20,
              },
            ]}
            key={`word${i}`}>
            <View
              style={[
                styles.innerWord,
                isEditable &&
                  (i + 1) % 4 !== 0 && {
                    ...styles.rightBorder,
                    borderRightColor: colors.primary20,
                  },
              ]}>
              <Typography type="commonTextBold">{i + 1 + '. '}</Typography>
              {isEditable ? (
                <TextInput
                  ref={el => {
                    wordsRef.current[i] = el as TextInput;
                  }}
                  editable={true}
                  value={word}
                  onChangeText={handleChange}
                  autoCorrect={false}
                  style={[styles.wordInput, { fontFamily: fonts.regular }]}
                />
              ) : (
                <Typography type="commonText" numberOfLines={1}>
                  {word}
                </Typography>
              )}
            </View>
          </View>
        );
      })}
      {isBlurred && (
        <BlurView style={styles.absolute} blurType="light" blurAmount={2} />
      )}
      {children}
    </View>
  );
};

export default SeedPhraseGrid;
