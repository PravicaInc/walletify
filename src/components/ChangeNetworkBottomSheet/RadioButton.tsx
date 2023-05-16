import React, { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';

interface RadioButtonProps {
  containerStyle?: ViewStyle;
  selected: boolean;
}

const RadioButton: React.FC<RadioButtonProps> = props => {
  const radioButtonStyles = StyleSheet.create({
    container: {
      height: 20,
      width: 20,
      borderRadius: 10,
      padding: 5,
      borderWidth: 2,
      alignItems: 'center',
      justifyContent: 'center',
    },
    innerCircle: {
      height: 12,
      width: 12,
      borderRadius: 6,
    },
  });
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <View
      style={[
        radioButtonStyles.container,
        {
          borderColor: props.selected ? colors.primary100 : colors.primary40,
        },
        props.containerStyle,
      ]}>
      {props.selected ? (
        <View
          style={[
            radioButtonStyles.innerCircle,
            {
              backgroundColor: colors.primary100,
            },
          ]}
        />
      ) : null}
    </View>
  );
};
export default RadioButton;
