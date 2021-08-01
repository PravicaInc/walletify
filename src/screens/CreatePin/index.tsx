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
import {CodeField} from 'react-native-confirmation-code-field';
import {resetNavigation} from '../../../routes';
import {useNavigation} from 'react-navigation-hooks';
import {doStoreSeed} from '../../store/wallet';
import {doSetPinCreated} from '../../store/onboarding/actions';
import {useWallet} from '../../hooks/useWallet';
import {ScrollView} from 'react-native-gesture-handler';
import {usePinCode} from '../../hooks/usePinCode';

const CreatePin: React.FC = () => {
  const {secretKey} = useWallet();
  const currentDispatch = useDispatch();
  const [enableMask, setEnableMask] = useState(true);

  const {renderCell, prop: props, ref, setValue, value} = usePinCode(
    styles.cell,
    styles.focusCell,
    undefined,
    true,
  );

  const {
    renderCell: renderSecondCell,
    prop: secondProps,
    ref: refSecond,
    setValue: setSecondValue,
    value: secondValue,
  } = usePinCode(styles.cell, styles.focusCell, undefined, true);

  const [status, setStatus] = useState('initial');
  const [error, setError] = useState('');

  const {dispatch} = useNavigation();

  const setLoadingStatus = () => setStatus('loading');
  const setErrorStatus = () => setStatus('error');

  const isLoading = status === 'loading';
  const toggleMask = () => setEnableMask((f) => !f);

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
          style={styles.white}>
          <KeyboardAvoidingView behavior={'padding'}>
            <Image
              style={styles.imageHeader}
              source={require('../../assets/key-pin.png')}
            />
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
                  ref={ref}
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
