import React, { useContext } from 'react';
import { TextProps, TouchableOpacity, View } from 'react-native';
import { MyText } from '../myText';
import { ThemeContext } from '../../../contexts/theme';

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
  callback?: (data: any) => void;
}

const CustomButton: React.FC<IProps> = props => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const styles = {
    wrapper: { flex: 1, height: 60 },
    container: {
      flex: 1,
      justifyContent: 'center',
      borderRadius: 13,
    },
    containerActivePrimary: { backgroundColor: colors.primary },
    containerInactivePrimary: { backgroundColor: colors.inactive },
    containerActiveSecondary: {
      backgroundColor: colors.contrast,
      borderWidth: 1,
      borderColor: colors.primary,
    },
    containerInactiveSecondary: {
      backgroundColor: colors.contrast,
      borderColor: colors.inactive,
      borderWidth: 1,
    },
    txt: { textAlign: 'center' },
    txtActivePrimary: { color: colors.contrast },
    txtInactivePrimary: { color: colors.contrast },
    txtActiveSecondary: { color: colors.text },
    txtInactiveSecondary: { color: colors.inactive },
  };

  let containerStyle = { ...styles.container },
    txtStyle = { ...styles.txt },
    customProps = {};

  switch (props.type) {
    case ACTIVE_PRIMARY:
      Object.assign(containerStyle, styles.containerActivePrimary);
      Object.assign(txtStyle, styles.txtActivePrimary);
      break;
    case INACTIVE_PRIMARY:
      Object.assign(containerStyle, styles.containerInactivePrimary);
      Object.assign(txtStyle, styles.txtInactivePrimary);
      customProps = { disabled: true };
      break;
    case ACTIVE_SECONDARY:
      Object.assign(containerStyle, styles.containerActiveSecondary);
      Object.assign(txtStyle, styles.txtActiveSecondary);
      break;
    case INACTIVE_SECONDARY:
      Object.assign(containerStyle, styles.containerInactiveSecondary);
      Object.assign(txtStyle, styles.txtInactiveSecondary);
      customProps = { disabled: true };
      break;
  }

  return (
    <TouchableOpacity
      style={styles.wrapper}
      onPress={props.callback}
      {...customProps}>
      <View style={containerStyle}>
        <MyText style={txtStyle} type="buttonText">
          {props.children}
        </MyText>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
