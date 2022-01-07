import React, { useCallback, useContext, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';
import { Typography } from '../shared/Typography';
import WarningIcon from '../shared/WarningIcon';

interface SimpleTextInputProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  subtext?: React.ReactNode;
  errorMessage?: string;
}

const SimpleTextInput: React.FC<SimpleTextInputProps> = ({
  label,
  icon,
  subtext,
  errorMessage,
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
      <Typography type="commonText" style={{ color: colors.primary40 }}>
        {label}
      </Typography>
      <View>
        <TextInput
          placeholderTextColor={colors.primary40}
          style={[
            styles.input,
            {
              color: colors.primary100,
              borderColor: inputFocused ? colors.primary100 : colors.primary40,
            },
          ]}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          {...props}
        />
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
      {touched && hasError && (
        <View style={styles.errorContainer}>
          <WarningIcon />
          <Typography
            type="smallText"
            style={[styles.error, { color: colors.failed100 }]}>
            {errorMessage}
          </Typography>
        </View>
      )}
      {subtext}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 13,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
    paddingRight: 60,
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
    marginBottom: 10,
  },
  error: {
    alignSelf: 'flex-start',
    marginLeft: 2,
  },
});

export default SimpleTextInput;
