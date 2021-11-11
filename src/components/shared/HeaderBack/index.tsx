import React, { useContext } from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import { Typography, StylesTypes } from '../Typography';
import { ThemeContext } from '../../../contexts/theme';
import Chevron from '../../../assets/chevron-right.svg';

interface IProps {
  onPress: () => void;
  text: string;
  textType?: StylesTypes;
  customStyle?: TextStyle;
  hasChevron?: boolean;
  chevronSize?: { height: number; width: number };
  onLayout?: (nativeEvent: LayoutChangeEvent) => void;
}

const HeaderBack: React.FC<IProps> = ({
  onPress,
  text,
  textType,
  hasChevron,
  chevronSize,
  customStyle,
  onLayout,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={styles.backContainer}
      onPress={onPress}
      onLayout={onLayout}>
      {hasChevron && (
        <Chevron
          width={chevronSize ? chevronSize.width : 7.5}
          height={chevronSize ? chevronSize.height : 13.5}
          style={styles.arrow}
          fill={colors.primary100}
        />
      )}
      <Typography
        type={textType || 'buttonText'}
        style={[{ color: colors.primary100 }, customStyle]}>
        {text}
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrow: {
    marginRight: 4,
  },
});

export default HeaderBack;
