import React, { useCallback, useContext, useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';
import { Typography } from '../shared/Typography';

interface IProps extends TextInputProps {
  label: string;
  icon?: React.ReactNode;
  subtext?: React.ReactNode;
}

const SimpleTextInput: React.FC<IProps> = ({
  label,
  icon,
  subtext,
  ...props
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const [inputFocused, setInputFocused] = useState(false);

  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
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
          style={[
            styles.input,
            {
              color: colors.primary40,
              borderColor: inputFocused ? colors.primary100 : colors.primary40,
            },
          ]}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          {...props}
        />
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
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
    marginBottom: 20,
  },
  icon: {
    position: 'absolute',
    bottom: 35,
    right: 16,
  },
});

export default SimpleTextInput;
