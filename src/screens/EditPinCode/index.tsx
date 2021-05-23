/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {popNavigation, resetNavigation} from '../../../routes';
import {useNavigation} from 'react-navigation-hooks';
import {doStoreSeed} from '../../store/wallet';
import {decrypt} from '@stacks/keychain';
import {selectCurrentWallet} from '../../store/wallet/selectors';

const EditPinCode: React.FC = () => {
  const currentDispatch = useDispatch();
  const wallet = useSelector(selectCurrentWallet);
  const [enableMask, setEnableMask] = useState(true);
  const [value, setValue] = useState('');
  const [firstValue, setFirstValue] = useState('');
  const [secondValue, setSecondValue] = useState('');
  const [status, setStatus] = useState('initial');
  const refSecond = useBlurOnFulfill({value: secondValue, cellCount: 4});
  const [error, setError] = useState('');
  const [firstProps, getFirstCellOnLayoutHandler] = useClearByFocusCell({
    firstValue,
    setFirstValue,
  });
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
    // else if (isFocused) {
    // textChild = <Cursor />;
    // }

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
    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getSecondCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const renderFirstCell = ({index, symbol, isFocused}) => {
    let textChild = null;

    if (symbol) {
      textChild = enableMask ? '•' : symbol;
    }
    return (
      <Text
        key={index}
        style={[styles.cell, isFocused && styles.focusCell]}
        onLayout={getFirstCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const onSubmit = async () => {
    setLoadingStatus();
    try {
      const decryptedKey = await decrypt(
        wallet?.encryptedBackupPhrase,
        firstValue,
      );
      if (decryptedKey) {
        if (value === secondValue) {
          setError('');
          const currentWallet = await doStoreSeed(
            decryptedKey as string,
            value,
          )(currentDispatch, () => ({}), {});
          if (currentWallet) {
            resetNavigation(dispatch, 'Home');
          }
        } else {
          setErrorStatus();
          setError('Seems your pincodes are not same');
        }
      }
    } catch (error) {
      setErrorStatus();
      setError('Something went wrong');
    }
  };

  const goBack = () => popNavigation(dispatch);
  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        accessible={false}
        style={{backgroundColor: 'white'}}>
        <KeyboardAvoidingView behavior={'padding'}>
          <TouchableOpacity
            onPress={goBack}
            style={[styles.cardItem, {marginBottom: 30}]}>
            <Image
              style={{width: 25, height: 15, marginRight: 16}}
              resizeMode="contain"
              source={require('../../assets/back_arrow.png')}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Change Your PIN</Text>
          <Text style={styles.description}>
            ATTENTION: You will use the new PIN through any WISE process that
            needs PIN entry.
          </Text>
          <Text style={styles.confirmPinCode}>Enter Current PIN</Text>
          <View
            style={[
              styles.fieldRow,
              {
                borderBottomWidth: 1,
                borderBottomColor: 'grey',
                paddingBottom: 16,
                marginBottom: 16,
              },
            ]}>
            <CodeField
              {...firstProps}
              value={firstValue}
              onChangeText={setFirstValue}
              cellCount={4}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={renderFirstCell}
            />
            <Text style={styles.toggle} onPress={toggleMask}>
              {enableMask ? '🙈' : '🐵'}
            </Text>
          </View>
          <Text style={styles.confirmPinCode}>Enter New PIN</Text>
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
            <Text style={styles.toggle} onPress={toggleMask}>
              {enableMask ? '🙈' : '🐵'}
            </Text>
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
          <Text style={styles.errorTextRed}>{error}</Text>
          <Pressable
            disabled={value !== secondValue || value === ''}
            onPress={onSubmit}
            style={[
              styles.loginButton,
              {opacity: value === secondValue && value !== '' ? 1 : 0.6},
            ]}>
            <>
              <Text style={styles.buttonText}>Change PIN</Text>
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
    </>
  );
};

export default EditPinCode;
