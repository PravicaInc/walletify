import React, { useContext } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { ThemeContext } from '../../contexts/theme';

import styles from './styles';

interface IProps {
  currentBarIdx: number;
  total: number;
  barsColor?: string;
  barIsCircle?: boolean;
  customStyle?: StyleProp<ViewStyle>;
}

const ProgressBar = ({
  currentBarIdx,
  total,
  barsColor,
  barIsCircle,
  customStyle,
}: IProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        barIsCircle && styles.roundedContainer,
        customStyle,
      ]}>
      {Array.from(Array(total)).map((_, barIdx) => (
        <View
          key={barIdx}
          style={[
            barIsCircle ? styles.roundedProgressItem : styles.progressItem,
            {
              backgroundColor:
                barIdx + 1 <= currentBarIdx
                  ? barsColor || colors.primary100
                  : colors.primary10,
            },
          ]}
        />
      ))}
    </View>
  );
};

export default ProgressBar;
