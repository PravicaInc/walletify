import React, { useContext } from 'react';
import { View, ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';

import { Typography } from '../../components/shared/Typography';

import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';

interface IProps {
  phrase: string;
  isBlurred: boolean;
}

const SeedPhraseGrid = (props: IProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const containerStyle = [styles.container, { backgroundColor: colors.card }];

  const renderWords = () =>
    props.phrase.split(' ').map((word, i) => {
      const wordStyle: ViewStyle[] = [styles.word];
      if (i + 1 < 21) {
        wordStyle.push({
          borderBottomWidth: 0.5,
          borderBottomColor: colors.primary20,
        });
      }
      return (
        <View style={wordStyle} key={`word${i}`}>
          <Typography type="commonTextBold">{i + 1 + '. '}</Typography>
          <Typography type="commonText" numberOfLines={1}>
            {word}
          </Typography>
        </View>
      );
    });

  return (
    <View style={containerStyle}>
      {renderWords()}
      {props.isBlurred && (
        <BlurView style={styles.absolute} blurType="light" blurAmount={2} />
      )}
    </View>
  );
};

export default SeedPhraseGrid;
