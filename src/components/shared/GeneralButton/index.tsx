import React, { useContext } from 'react';
import {
  TouchableOpacityProps,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { Typography } from '../Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import styles from './styles';
import { isIosApp } from '../../../shared/helpers';

interface IProps extends TouchableOpacityProps {
  loading: boolean;
  canGoNext: boolean;
  text: string;
  onClick: () => void;
}

const GeneralButton = React.forwardRef<TouchableOpacity, IProps>(
  ({ canGoNext, onClick, text, loading }, ref) => {
    const {
      theme: { colors },
    } = useContext(ThemeContext);
    const PressComponent: any = isIosApp
      ? TouchableOpacity
      : TouchableHighlight;

    return (
      <PressComponent
        ref={ref}
        underlayColor={colors.primary60}
        style={
          isIosApp
            ? styles.containerIOS
            : {
                ...styles.container,
                backgroundColor: canGoNext
                  ? colors.primary100
                  : colors.primary20,
              }
        }
        onPress={onClick}
        disabled={!canGoNext || loading}>
        {loading ? (
          <ActivityIndicator
            color={isIosApp ? colors.primary40 : colors.white}
          />
        ) : (
          <Typography
            type="buttonText"
            style={[
              {
                color: isIosApp
                  ? canGoNext
                    ? colors.secondary100
                    : colors.primary40
                  : colors.white,
              },
            ]}>
            {text}
          </Typography>
        )}
      </PressComponent>
    );
  },
);

export default GeneralButton;
