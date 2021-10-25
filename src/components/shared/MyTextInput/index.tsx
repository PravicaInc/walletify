import * as React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../../../contexts/theme';
// import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CloseIcon from '../../../assets/icon-reject-contact.svg';
import HiddenEye from '../../../assets/hidden-eye.svg';
import VisibleEye from '../../../assets/visible-eye.svg';
import { MyText } from '../myText';

interface IProps extends TextInputProps {
  customStyle?: StyleProp<TextStyle>;
  errorMessage?: string;
  setErrorMessage?: (val: string) => void;
  normalInput?: boolean;
  labelText?: string;
  disableCancel?: boolean;
}
export const MyTextInput = React.forwardRef<any, IProps>((props, ref) => {
  const {
    theme: { colors, fonts },
  } = useContext(ThemeContext);
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isEyeClosed, toggleEye] = useState<boolean>(true);
  const [touched, setTouched] = useState<boolean>(false);
  const { onChangeText, errorMessage, setErrorMessage, normalInput } = props;
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
    <>
      {props.labelText && (
        <View>
          <MyText
            type="commonText"
            style={[
              styles.label,
              { color: inputFocused ? colors.primary100 : colors.primary100 },
            ]}>
            {props.labelText}
          </MyText>
        </View>
      )}
      <View
        style={[
          styles.searchWrapper,
          {
            shadowColor: hasError ? colors.failed100 : colors.primary100,
            shadowOpacity: inputFocused ? 0.9 : 0,
            borderColor: hasError
              ? colors.failed10
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
        {/* {normalInput ? (
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
          />
        ) : (
          <BottomSheetTextInput
            ref={ref}
            style={[
              styles.search,
              {
                fontFamily: fonts.regular,
                color: colors.primary100,
              },
            ]}
            accessibilityComponentType
            accessibilityTraits
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholderTextColor={colors.primary40}
            {...props}
          />
        )} */}
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
      {touched && hasError && (
        <View style={styles.errorContainer}>
          <MyText
            type="commonText"
            style={[
              styles.error,
              { color: colors.failed100 },
              { marginLeft: '5%' },
            ]}>
            {errorMessage}
          </MyText>
        </View>
      )}
    </>
  );
});

const styles = StyleSheet.create({
  searchWrapper: {
    shadowOffset: {
      width: 0.2,
      height: 0.2,
    },
    borderWidth: 0.5,
    shadowRadius: 1.5,
    borderRadius: 13,
    marginTop: 12,
    marginBottom: 8,
    marginHorizontal: '2.5%',
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
    zIndex: 111,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eye: {
    position: 'absolute',
    right: 16,
    top: '25%',
    zIndex: 111,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { marginBottom: 5 },
  errorContainer: {
    alignSelf: 'flex-start',
  },
  error: {
    alignSelf: 'flex-start',
    marginLeft: '5%',
  },
});
