import React, { useContext } from 'react';
import {
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  LayoutChangeEvent,
  Platform,
} from 'react-native';
import { Typography, StylesTypes } from '../Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import Chevron from '../../../assets/chevron-right.svg';
import Close from '../../../assets/images/close.svg';
import ArrowLeft from '../../../assets/images/arrowLeft.svg';

interface IProps {
  onPress: () => void;
  text?: string;
  textType?: StylesTypes;
  textColor?: string;
  customStyle?: TextStyle;
  disabled?: boolean;
  hasChevron?: boolean;
  chevronSize?: { height: number; width: number };
  chevronColor?: string;
  onLayout?: (nativeEvent: LayoutChangeEvent) => void;
  isCancel?: boolean;
  isBack?: boolean;
}

const HeaderBack: React.FC<IProps> = ({
  onPress,
  text,
  textType,
  textColor,
  chevronSize,
  chevronColor,
  customStyle,
  onLayout,
  disabled,
  isCancel,
  isBack,
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
      {isBack && (
        <>
          {Platform.OS === 'ios' ? (
            <Chevron
              width={chevronSize ? chevronSize.width : 7.5}
              height={chevronSize ? chevronSize.height : 13.5}
              style={styles.arrow}
              fill={chevronColor ? chevronColor : colors.primary100}
            />
          ) : (
            <ArrowLeft />
          )}
          {Platform.OS === 'ios' && (
            <Typography
              type={textType || 'buttonText'}
              style={[{ color: textColor || colors.primary100 }, customStyle]}>
              Back
            </Typography>
          )}
        </>
      )}
      {isCancel && (
        <>
          {Platform.OS === 'android' ? (
            <Close />
          ) : (
            <Chevron
              width={chevronSize ? chevronSize.width : 7.5}
              height={chevronSize ? chevronSize.height : 13.5}
              style={styles.arrow}
              fill={chevronColor ? chevronColor : colors.primary100}
            />
          )}
          {Platform.OS === 'ios' && (
            <Typography
              type={textType || 'buttonText'}
              style={[{ color: textColor || colors.primary100 }, customStyle]}>
              Cancel
            </Typography>
          )}
        </>
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
