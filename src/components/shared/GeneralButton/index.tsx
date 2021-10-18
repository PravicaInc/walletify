import React, { useContext } from 'react';
import { TouchableOpacityProps, TouchableOpacity, View } from 'react-native';
import { Typography } from '../Typography';
import { ThemeContext } from '../../../contexts/theme';
import styles from './styles';

export const ACTIVE_PRIMARY = 'activePrimary';
type activePrimaryType = typeof ACTIVE_PRIMARY;
export const INACTIVE_PRIMARY = 'inactivePrimary';
type inactivePrimaryType = typeof INACTIVE_PRIMARY;
export const ACTIVE_SECONDARY = 'activeSecondary';
type activeSecondaryType = typeof ACTIVE_SECONDARY;
export const INACTIVE_SECONDARY = 'inactiveSecondary';
type inactiveSecondaryType = typeof INACTIVE_SECONDARY;

interface IProps extends TouchableOpacityProps {
  type:
    | activePrimaryType
    | inactivePrimaryType
    | activeSecondaryType
    | inactiveSecondaryType;
}

const CustomButton = React.forwardRef<TouchableOpacity, IProps>(
  (props, ref) => {
    const {
      theme: { colors },
    } = useContext(ThemeContext);

    let containerStyle;
    let txtStyle;
    const disabled =
      props.type === INACTIVE_PRIMARY || props.type === INACTIVE_SECONDARY;

    switch (props.type) {
      case ACTIVE_PRIMARY:
        containerStyle = { backgroundColor: colors.primary };
        txtStyle = { color: colors.contrast };
        break;
      case INACTIVE_PRIMARY:
        containerStyle = { backgroundColor: colors.inactive };
        txtStyle = { color: colors.contrast };
        break;
      case ACTIVE_SECONDARY:
        containerStyle = {
          ...styles.containerActiveSecondary,
          backgroundColor: colors.contrast,
          borderColor: colors.primary,
        };
        txtStyle = { color: colors.text };
        break;
      case INACTIVE_SECONDARY:
        containerStyle = {
          ...styles.containerActiveSecondary,
          backgroundColor: colors.contrast,
          borderColor: colors.inactive,
        };
        txtStyle = { color: colors.inactive };
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

export default CustomButton;
