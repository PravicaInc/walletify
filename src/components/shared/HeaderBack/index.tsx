import React, { useContext } from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  LayoutChangeEvent,
} from 'react-native';
import { Typography, StylesTypes } from '../Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import Chevron from '../../../assets/chevron-right.svg';

interface IProps {
  onPress: () => void;
  text?: string;
  textType?: StylesTypes;
  textColor?: string;
  customStyle?: TextStyle;
  disabled?: boolean;
  hasChevron?: boolean;
  chevronSize?: { height: number; width: number };
  onLayout?: (nativeEvent: LayoutChangeEvent) => void;
}

const HeaderBack: React.FC<IProps> = ({
  onPress,
  text,
  textType,
  textColor,
  hasChevron,
  chevronSize,
  customStyle,
  onLayout,
  disabled,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[styles.backContainer, customStyle]}
      onPress={onPress}
      disabled={disabled}
      onLayout={onLayout}>
      {hasChevron && (
        <Chevron
          width={chevronSize ? chevronSize.width : 7.5}
          height={chevronSize ? chevronSize.height : 13.5}
          style={styles.arrow}
          fill={colors.primary100}
        />
      )}
      {text && (
        <Typography
          type={textType || 'buttonText'}
          style={[{ color: textColor || colors.primary100 }, customStyle]}>
          {text}
        </Typography>
      )}
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
