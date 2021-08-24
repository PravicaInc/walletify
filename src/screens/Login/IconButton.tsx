import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
} from 'react-native';
import {theme} from '../../../theme';
import {isWideScreen} from '../../utils';

enum ButtonType {
  Filled,
  Border,
}

interface IconButtonProps extends TouchableHighlightProps {
  text: string;
  icon: any;
  buttonType: ButtonType;
}

const IconButton: React.FC<IconButtonProps> = props => {
  const isFilled = props.buttonType === ButtonType.Filled;

  const buttonStyle = isFilled
    ? styles.filledButton
    : {...styles.filledButton, ...styles.borderedButton};

  const textStyle = isFilled
    ? styles.filledButtonText
    : {...styles.filledButtonText, ...styles.borderedButtonText};

  return (
    <TouchableHighlight style={buttonStyle} {...props}>
      <>
        <Text style={textStyle}>{props.text}</Text>

        <Image style={styles.loginLogo} source={props.icon} />
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  filledButton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    flexDirection: 'row',
    marginTop: isWideScreen ? 35 : 16,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: {height: 1, width: 0},
    shadowOpacity: 0.75,
    shadowRadius: 1,
    width: '100%',
    height: 48,
    backgroundColor: theme.colors.badgeBackground,
  },

  borderedButton: {
    backgroundColor: 'white',
    borderColor: theme.colors.badgeBackground,
    borderWidth: 1,
  },
  loginLogo: {width: 24, height: 24},
  filledButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  borderedButtonText: {
    color: theme.colors.badgeBackground,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: 'bold',
  },
});

export default IconButton;
