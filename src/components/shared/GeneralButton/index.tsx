import React, { useContext } from 'react';
import { TouchableOpacityProps, TouchableOpacity, View } from 'react-native';
import { Typography } from '../Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import styles from './styles';

interface IProps extends TouchableOpacityProps {
  type: 'Primary' | 'Secondary';
}

const GeneralButton = React.forwardRef<TouchableOpacity, IProps>(
  (props, ref) => {
    const {
      theme: { colors },
    } = useContext(ThemeContext);

    const { type, disabled } = props;

    let containerStyle;
    let txtStyle;

    switch (type) {
      case 'Primary':
        if (disabled) {
          containerStyle = { backgroundColor: colors.primary20 };
          txtStyle = { color: colors.white };
        } else {
          containerStyle = { backgroundColor: colors.primary100 };
          txtStyle = { color: colors.white };
        }
        break;
      case 'Secondary':
        if (disabled) {
          containerStyle = {
            ...styles.containerActiveSecondary,
            backgroundColor: colors.white,
            borderColor: colors.primary40,
          };
          txtStyle = { color: colors.primary40 };
        } else {
          containerStyle = {
            ...styles.containerActiveSecondary,
            backgroundColor: colors.white,
            borderColor: colors.primary100,
          };
          txtStyle = { color: colors.primary100 };
        }
        break;
    }

    return (
      <TouchableOpacity
        ref={ref}
        disabled={disabled}
        {...props}
        style={[styles.wrapper, props.style]}>
        <View style={[styles.container, containerStyle]}>
          <Typography style={[styles.txt, txtStyle]} type="buttonText">
            {props.children}
          </Typography>
        </View>
      </TouchableOpacity>
    );
  },
);

export default GeneralButton;
