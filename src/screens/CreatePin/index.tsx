/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {selectSecretKey} from '../../store/onboarding/selectors';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {resetNavigation} from '../../../routes';
import {useNavigation} from 'react-navigation-hooks';
import {doStoreSeed} from '../../store/wallet';

const CreatePin: React.FC = () => {
  const secretKey = useSelector(selectSecretKey);
  const currentDispatch = useDispatch();
  const [enableMask, setEnableMask] = useState(true);
  const [value, setValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [status, setStatus] = useState('initial');
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const refSecond = useBlurOnFulfill({secondValue, cellCount: 4});
  const [error, setError] = useState('');
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [secondProps, getSecondCellOnLayoutHandler] = useClearByFocusCell({
    secondValue,
    setSecondValue,
  });
  const {dispatch} = useNavigation();

  const setLoadingStatus = () => setStatus('loading');
  const setErrorStatus = () => setStatus('error');

  const isLoading = status === 'loading';
  const toggleMask = () => setEnableMask((f) => !f);
  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = enableMask ? '•' : symbol;
    }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const renderSecondCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = enableMask ? '•' : symbol;
    }
    // else if (isFocused) {
    //   textChild = <Cursor />;
    // }

    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getSecondCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const onSubmit = async () => {
    setLoadingStatus();
    if (value === secondValue) {
      setError('');
      const currentWallet = await doStoreSeed(secretKey as string, value)(
        currentDispatch,
        () => ({}),
        {},
      );
      if (currentWallet && currentWallet.identities[0].defaultUsername) {
        resetNavigation(dispatch, 'Home');
      } else {
        resetNavigation(dispatch, 'Username');
      }
    } else {
      setErrorStatus();
      setError('Seems your pincodes are not same');
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <KeyboardAvoidingView behavior={'position'}>
            <View style={styles.card}>
              <Text style={styles.title}>Your Secret Key</Text>
              <Text style={styles.description}>
                Here’s your Secret Key: 12 words that prove it’s you when you
                want to use on a new device. Once lost it’s lost forever, so
                save it somewhere you won’t forget.
              </Text>
              <Text style={styles.confirmPinCode}>Enter your pin code</Text>
              <View style={styles.fieldRow}>
                <CodeField
                  ref={ref}
                  {...props}
                  value={value}
                  onChangeText={setValue}
                  cellCount={4}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={renderCell}
                />
                <Text style={styles.toggle} onPress={toggleMask}>
                  {enableMask ? '🙈' : '🐵'}
                </Text>
              </View>
              <Text style={styles.confirmPinCode}>Confirm Pin code</Text>
              <View style={styles.fieldRow}>
                <CodeField
                  ref={refSecond}
                  {...secondProps}
                  value={secondValue}
                  onChangeText={setSecondValue}
                  cellCount={4}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={renderSecondCell}
                />
              </View>
              <Text style={styles.errorTextRed}>{error}</Text>
            </View>
            <TouchableOpacity
              disabled={isLoading}
              onPress={onSubmit}
              style={styles.loginButton}>
              <>
                <Text style={styles.buttonText}>Encrypt your secret key</Text>
                {isLoading ? (
                  <ActivityIndicator size={'small'} color={'white'} />
                ) : (
                  <Image
                    style={styles.loginLogo}
                    source={require('../../assets/login.png')}
                  />
                )}
              </>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default CreatePin;
