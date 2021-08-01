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
import {CodeField} from 'react-native-confirmation-code-field';
import {popNavigation, resetNavigation} from '../../../routes';
import {useNavigation} from 'react-navigation-hooks';
import {doStoreSeed} from '../../store/wallet';
import {decrypt} from '@stacks/keychain';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {usePinCode} from '../../hooks/usePinCode';
interface PinInterface {
  index: number;
  symbol: any;
  isFocused: boolean;
}

const EditPinCode: React.FC = () => {
  const currentDispatch = useDispatch();
  const wallet = useSelector(selectCurrentWallet);
  const [enableMask, setEnableMask] = useState(true);
  const {renderCell, prop: props, ref, setValue, value} = usePinCode(
    styles.cell,
    styles.focusCell,
  );

  const {
    renderCell: renderSecondCell,
    prop: secondProps,
    ref: refSecond,
    setValue: setSecondValue,
    value: secondValue,
  } = usePinCode(styles.cell, styles.focusCell);

  const {
    renderCell: renderFirstCell,
    prop: firstProps,
    ref: refFirst,
    setValue: setFirstValue,
    value: firstValue,
  } = usePinCode(styles.cell, styles.focusCell);

  const [status, setStatus] = useState('initial');
  const [error, setError] = useState('');

  const {dispatch} = useNavigation();

  const setLoadingStatus = () => setStatus('loading');
  const setErrorStatus = () => setStatus('error');

  const isLoading = status === 'loading';
  const toggleMask = () => setEnableMask((f) => !f);
  const goBack = () => popNavigation(dispatch);

  const onSubmit = async () => {
    setLoadingStatus();
    try {
      const decryptedKey = await decrypt(
        wallet!.encryptedBackupPhrase,
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
          setError("Seems your pincodes don't match");
        }
      }
    } catch (e) {
      setErrorStatus();
      setError('Something went wrong');
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        accessible={false}
        style={styles.white}>
        <KeyboardAvoidingView behavior={'padding'}>
          <TouchableOpacity onPress={goBack} style={[styles.cardItem]}>
            <Image
              style={styles.back}
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
              // eslint-disable-next-line react-native/no-inline-styles
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
              ref={refFirst}
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
              ref={ref}
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
