import React from 'react';
import {Text, TextProps, TouchableOpacity, View} from 'react-native';

import styles from './styles';

export const ACTIVE_PRIMARY = 'activePrimary';
type activePrimaryType = typeof ACTIVE_PRIMARY;
export const INACTIVE_PRIMARY = 'inactivePrimary';
type inactivePrimaryType = typeof INACTIVE_PRIMARY;
export const ACTIVE_SECONDARY = 'activeSecondary';
type activeSecondaryType = typeof ACTIVE_SECONDARY;
export const INACTIVE_SECONDARY = 'inactiveSecondary';
type inactiveSecondaryType = typeof INACTIVE_SECONDARY;

interface IProps extends TextProps {
  type:
    | activePrimaryType
    | inactivePrimaryType
    | activeSecondaryType
    | inactiveSecondaryType;
}

const CustomButton: React.FC<IProps> = props => {
  let containerStyle = {...styles.container},
    txtStyle = {};

  switch (props.type) {
    case ACTIVE_PRIMARY:
      Object.assign(containerStyle, styles.containerActivePrimary);
      Object.assign(txtStyle, styles.txtActivePrimary);
      break;
    case INACTIVE_PRIMARY:
      Object.assign(containerStyle, styles.containerInactivePrimary);
      Object.assign(txtStyle, styles.txtActivePrimary);
      break;
    case ACTIVE_SECONDARY:
      Object.assign(containerStyle, styles.containerActiveSecondary);
      Object.assign(txtStyle, styles.txtActiveSecondary);
      break;
    case INACTIVE_SECONDARY:
      Object.assign(containerStyle, styles.containerInactivePrimary);
      Object.assign(txtStyle, styles.txtInactivePrimary);
      break;
  }

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={() => {
        console.log('props', props);
      }}>
      <View style={containerStyle}>
        <Text style={txtStyle}>{props.children}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
