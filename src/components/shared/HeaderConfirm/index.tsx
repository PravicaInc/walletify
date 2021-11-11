import React, { useContext } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { Typography, StylesTypes } from '../Typography';
import { ThemeContext } from '../../../contexts/theme';

interface IProps {
  onPress: () => void;
  text: string;
  textType?: StylesTypes;
  customStyle?: TextStyle;
  disabled?: boolean;
  isLoading?: boolean;
}

const HeaderConfirm: React.FC<IProps> = ({
  onPress,
  text,
  textType,
  customStyle,
  disabled,
  isLoading,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={styles.confirmContainer}
      onPress={onPress}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator color={colors.primary40} />
      ) : (
        <Typography
          type={textType || 'buttonText'}
          style={[
            { color: colors.primary100 },
            customStyle,
            disabled ? { color: colors.primary40 } : null,
          ]}>
          {text}
        </Typography>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  confirmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default HeaderConfirm;
