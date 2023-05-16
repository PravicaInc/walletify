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
import BackIcon from '../../../assets/icon-back-android.svg';
import CloseIcon from '../../../assets/icon-close-android.svg';
import { isIosApp } from '../../../shared/helpers';

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
}

const HeaderBack: React.FC<IProps> = ({
  onPress,
  text,
  textType,
  textColor,
  hasChevron,
  chevronSize,
  chevronColor,
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
      {!isIosApp &&
        (hasChevron ? (
          <BackIcon
            fill={chevronColor ? chevronColor : colors.activeState}
            width={16}
            height={16}
          />
        ) : (
          <CloseIcon />
        ))}
      {hasChevron && isIosApp && (
        <Chevron
          width={chevronSize ? chevronSize.width : 7.5}
          height={chevronSize ? chevronSize.height : 13.5}
          style={styles.arrow}
          fill={chevronColor ? chevronColor : colors.activeState}
        />
      )}
      {text && isIosApp && (
        <Typography
          type={textType || 'buttonText'}
          style={[{ color: textColor || colors.activeState }, customStyle]}>
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
