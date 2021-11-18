import React, { useContext } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';

import styles from './styles';

interface IProps {
  finished: number;
  total: number;
  barsColor?: string;
  customStyle?: StyleProp<ViewStyle>;
}

const ProgressBar = (props: IProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const renderProgressItems = () => {
    const items = [];
    for (let i = 0; i < props.total; i++) {
      const itemStyle = [
        styles.progressItem,
        {
          backgroundColor:
            i + 1 <= props.finished
              ? props.barsColor || colors.primary100
              : colors.primary10,
        },
      ];
      items.push(<View key={i} style={itemStyle} />);
    }
    return items;
  };

  return (
    <View style={[styles.container, props.customStyle]}>
      {renderProgressItems()}
    </View>
  );
};

export default ProgressBar;
