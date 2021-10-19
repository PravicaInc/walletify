import React, { useContext } from 'react';
import { View, ViewStyle } from 'react-native';

import { MyText } from '../../components/shared/myText';

import { ThemeContext } from '../../contexts/theme';
import styles from './styles';

interface IProps {
  phrase: string[];
}

const SeedPhraseGrid = (props: IProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.cardsBackground },
  ];

  const renderWords = () =>
    props.phrase.map((word, i) => {
      const wordStyle: ViewStyle[] = [styles.word];
      if (i + 1 < 21)
        wordStyle.push({
          borderBottomWidth: 0.5,
          borderBottomColor: colors.lines,
        });
      return (
        <View style={wordStyle} key={word}>
          <MyText type="commonTextBold">{i + 1 + '. '}</MyText>
          <MyText type="commonText" numberOfLines={1}>
            {word}
          </MyText>
        </View>
      );
    });

  return <View style={containerStyle}>{renderWords()}</View>;
};

export default SeedPhraseGrid;
