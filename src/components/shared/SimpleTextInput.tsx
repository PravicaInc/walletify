import React, { useCallback, useContext, useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TextInputProps,
  TextStyle,
} from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';
import { Typography } from '../shared/Typography';
import WarningIcon from '../shared/WarningIcon';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';

interface SimpleTextInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  subtext?: React.ReactNode;
  errorMessage?: string;
  isBottomSheet?: boolean;
  labelStyle?: TextStyle;
}

const SimpleTextInput: React.FC<SimpleTextInputProps> = ({
  label,
  icon,
  subtext,
  errorMessage,
  labelStyle,
  ...props
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [inputFocused, setInputFocused] = useState(false);
  const [touched, setTouched] = useState<boolean>(false);
  const hasError = Number(errorMessage?.length) > 0;

  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
    setTouched(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
  }, []);

  return (
    <View style={styles.container}>
      <Typography
        type="commonText"
        style={[{ color: colors.primary40 }, labelStyle]}>
        {label}
      </Typography>
      <View>
        {props.isBottomSheet ? (
          <BottomSheetTextInput
            placeholderTextColor={colors.primary40}
            style={[
              styles.input,
              {
                color: colors.primary100,
                borderColor: inputFocused
                  ? colors.primary100
                  : colors.primary40,
              },
            ]}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            {...props}
          />
        ) : (
          <TextInput
            placeholderTextColor={colors.primary40}
            style={[
              styles.input,
              {
                color: colors.primary100,
                borderColor: inputFocused
                  ? colors.primary100
                  : colors.primary40,
              },
            ]}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            {...props}
          />
        )}
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
      <View style={styles.wrapper}>
        {touched && hasError ? (
          <View style={styles.errorContainer}>
            <WarningIcon />
            <Typography
              type="smallText"
              style={[styles.error, { color: colors.failed100 }]}>
              {errorMessage}
            </Typography>
          </View>
        ) : (
          <View />
        )}
        {subtext}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    marginTop: 20,
    marginBottom: 20,
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 13,
    padding: 16,
    marginTop: 10,
    paddingRight: 60,
    width: '99%',
  },
  wrapper: {
    bottom: -20,
    position: 'absolute',
    width: '99%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    position: 'absolute',
    right: 0,
    height: 60,
    padding: 16,
    marginTop: 10,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  errorContainer: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  error: {
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
});

export default SimpleTextInput;
