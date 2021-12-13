import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import WarningIcon from '../../../assets/icon-warning.svg';
import CloseIcon from '../../../assets/icon-reject-contact.svg';
import HiddenEye from '../../../assets/hidden-eye.svg';
import VisibleEye from '../../../assets/visible-eye.svg';
import { Typography } from '../Typography';

interface IProps extends TextInputProps {
  outerWrapperStyle?: StyleProp<TextStyle>;
  customStyle?: StyleProp<TextStyle>;
  errorMessage?: string;
  setErrorMessage?: (val: string) => void;
  labelText?: string;
  disableCancel?: boolean;
  guide?: React.ReactNode;
}
export const GeneralTextInput = React.forwardRef<any, IProps>((props, ref) => {
  const {
    theme: { colors, fonts },
  } = useContext(ThemeContext);

  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isEyeClosed, toggleEye] = useState<boolean>(true);
  const [touched, setTouched] = useState<boolean>(false);
  const { onChangeText, errorMessage, setErrorMessage } = props;
  const hasError = Number(errorMessage?.length) > 0;
  useEffect(() => {
    setErrorMessage && setErrorMessage('');
  }, [setErrorMessage, props.value]);
  const handleInputFocus = useCallback(() => {
    setInputFocused(true);
    setTouched(true);
  }, []);
  const handleInputBlur = useCallback(() => {
    setInputFocused(false);
  }, []);
  const handleClearInput = useCallback(() => {
    onChangeText && onChangeText('');
    setErrorMessage && setErrorMessage('');
  }, [onChangeText, setErrorMessage]);
  const handleToggleEye = useCallback(() => {
    toggleEye(prevState => !prevState);
  }, []);

  return (
    <View style={[styles.wrapper, props.outerWrapperStyle]}>
      {props.labelText && (
        <View>
          <Typography
            type="commonText"
            style={[
              styles.label,
              { color: inputFocused ? colors.primary100 : colors.primary100 },
            ]}>
            {props.labelText}
          </Typography>
        </View>
      )}
      <View
        style={[
          styles.searchWrapper,
          {
            shadowColor: hasError ? colors.failed100 : colors.primary100,
            shadowOpacity: inputFocused ? 0.9 : 0,
            borderColor:
              hasError && touched
                ? colors.failed100
                : inputFocused
                ? colors.primary10
                : colors.primary40,
            backgroundColor: colors.white,
          },
          props.customStyle,
        ]}>
        <TextInput
          ref={ref}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholderTextColor={colors.primary40}
          style={[
            styles.search,
            {
              fontFamily: fonts.regular,
              color: colors.primary100,
            },
          ]}
          {...props}
          secureTextEntry={isEyeClosed}
        />
        {Number(props.value?.length) > 0 && !props.disableCancel && (
          <TouchableOpacity
            onPress={handleClearInput}
            activeOpacity={0.6}
            containerStyle={styles.close}>
            <CloseIcon width={8} height={8} fill={colors.primary40} />
          </TouchableOpacity>
        )}
        {props.secureTextEntry && (
          <TouchableOpacity
            onPress={handleToggleEye}
            activeOpacity={0.6}
            containerStyle={styles.eye}>
            {isEyeClosed ? <HiddenEye /> : <VisibleEye />}
          </TouchableOpacity>
        )}
      </View>
      {props.guide && !(touched && hasError) && props.guide}
      {touched && hasError && (
        <View style={styles.errorContainer}>
          <WarningIcon width={12} height={12} fill={colors.failed100} />
          <Typography
            type="smallText"
            style={[styles.error, { color: colors.failed100 }]}>
            {errorMessage}
          </Typography>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  searchWrapper: {
    shadowOffset: {
      width: 0.2,
      height: 0.2,
    },
    borderWidth: 0.5,
    shadowRadius: 1.5,
    borderRadius: 13,
    width: '99%',
    marginTop: 12,
    marginBottom: 8,
  },
  search: {
    width: '90%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'relative',
    fontSize: 15,
    flex: 1,
  },
  close: {
    position: 'absolute',
    right: 8,
    top: 8,
    zIndex: 1,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    position: 'absolute',
    right: 16,
    top: '25%',
    zIndex: 1,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { marginBottom: 5 },
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
