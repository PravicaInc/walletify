/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {styles} from './styles';
import {useDispatch} from 'react-redux';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {resetNavigation} from '../../../routes';
import {useNavigation} from 'react-navigation-hooks';
import {doStoreSeed} from '../../store/wallet';
import {doSetPinCreated} from '../../store/onboarding/actions';
import {useWallet} from '../../hooks/useWallet';
import {ScrollView} from 'react-native-gesture-handler';

const CreatePin: React.FC = () => {
  const {secretKey} = useWallet();
  const currentDispatch = useDispatch();
  const [enableMask, setEnableMask] = useState(true);
  const [value, setValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [status, setStatus] = useState('initial');
  const refSecond = useBlurOnFulfill({value: secondValue, cellCount: 4});
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
      <View
        key={index}
        style={[
          styles.cell,
          isFocused && styles.focusCell,
          {marginLeft: index === 0 ? 0 : 8},
        ]}
        onLayout={getCellOnLayoutHandler(index)}>
        <Text style={styles.textChild}>{textChild}</Text>
      </View>
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
      <View
        key={index}
        style={[
          styles.cell,
          isFocused && styles.focusCell,
          {marginLeft: index === 0 ? 0 : 8},
        ]}
        onLayout={getSecondCellOnLayoutHandler(index)}>
        <Text style={styles.textChild}>{textChild}</Text>
      </View>
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
      currentDispatch(doSetPinCreated(true));
      if (currentWallet && currentWallet.identities[0].defaultUsername) {
        resetNavigation(dispatch, 'Home');
      } else {
        resetNavigation(dispatch, 'Username');
      }
    } else {
      setErrorStatus();
      setError('Seems your PINs are not same');
    }
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          style={{backgroundColor: 'white'}}>
          <KeyboardAvoidingView behavior={'padding'}>
            <Image source={require('../../assets/key-pin.png')} />
            <View>
              <Text style={styles.title}>Encrypt Your Seed Phrase</Text>
              <Text style={styles.description}>
                Your seed phrase will be used in decrypting and signing
                processes, it’s unsafe to be stored locally in plain text, your
                PIN URGENTLY needed to secure your seed phrase.
              </Text>
              <Text style={styles.confirmPinCode}>Enter your PIN</Text>
              <View style={styles.fieldRow}>
                <CodeField
                  {...props}
                  value={value}
                  onChangeText={setValue}
                  cellCount={4}
                  keyboardType="number-pad"
                  textContentType="oneTimeCode"
                  renderCell={renderCell}
                />
              </View>
              <Text style={styles.confirmPinCode}>Confirm PIN</Text>
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
              <Text style={styles.toggle} onPress={toggleMask}>
                {enableMask ? '🙈' : '🐵'}
              </Text>
              <Text style={styles.errorTextRed}>{error}</Text>
            </View>
            <Pressable
              disabled={value !== secondValue || value === ''}
              onPress={onSubmit}
              style={[
                styles.loginButton,
                {opacity: value === secondValue && value !== '' ? 1 : 0.6},
              ]}>
              <>
                <Text style={styles.buttonText}>Encrypt your Seed Phrase</Text>
                {isLoading ? (
                  <ActivityIndicator size={'small'} color={'white'} />
                ) : (
                  <Image
                    style={styles.loginLogo}
                    source={require('../../assets/login.png')}
                  />
                )}
              </>
            </Pressable>
          </KeyboardAvoidingView>
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default CreatePin;
