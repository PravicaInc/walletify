import React, { useContext } from 'react';
import { View } from 'react-native';
import { ThemeContext } from '../../contexts/theme';

import styles from './styles';

interface IProps {
  finished: number;
  total: number;
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
            i + 1 <= props.finished ? colors.primary : colors.lines,
        },
      ];
      items.push(<View key={i} style={itemStyle} />);
    }
    return items;
  };

  return <View style={styles.container}>{renderProgressItems()}</View>;
};

export default ProgressBar;
