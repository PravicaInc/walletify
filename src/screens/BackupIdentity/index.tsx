/* eslint-disable react-hooks/exhaustive-deps */
import {decrypt} from '@stacks/keychain';
import React, {useState} from 'react';
import {
  Alert,
  Clipboard,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useNavigation} from 'react-navigation-hooks';
import {useSelector} from 'react-redux';
import {popNavigation} from '../../../routes';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {styles} from './styles';

const BackupIdentity: React.FC = () => {
  const goBack = () => popNavigation(dispatch);
  const {dispatch} = useNavigation();
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [err, setError] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const wallet = useSelector(selectCurrentWallet);

  const renderCell = ({index, symbol, isFocused}) => {
    let textChild = null;
    if (symbol) {
      textChild = '•';
    }
    return (
      <Text
        key={index}
        style={[
          styles.cell,
          isFocused && styles.focusCell,
          err.length > 0 && styles.errCell,
        ]}
        onLayout={getCellOnLayoutHandler(index)}>
        {textChild}
      </Text>
    );
  };

  const submit = async (text: string) => {
    try {
      setError('');
      const decryptedKey = await decrypt(wallet?.encryptedBackupPhrase, text);
      if (decryptedKey) {
        setSecretKey(decryptedKey);
      } else {
        throw new Error();
      }
    } catch (error) {
      setError('Invalid PIN');
    }
  };

  const onSubmit = async () => {
    if (secretKey) {
      Clipboard.setString(secretKey);
      Alert.alert('Copied!');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={goBack}
          style={[styles.cardItem, {marginBottom: 20}]}>
          <Image
            style={{width: 25, height: 15, marginRight: 16}}
            resizeMode="contain"
            source={require('../../assets/back_arrow.png')}
          />
        </TouchableOpacity>
        <Text style={styles.desc}>
          In-order to decrypt your seed phrase you have to enter your PIN.
        </Text>
        {secretKey.length > 0 ? (
          <View style={{marginTop: 20}}>
            <TextInput
              placeholder={'Your seed phrase'}
              placeholderTextColor={'black'}
              style={styles.textInput}
              editable={false}
              value={secretKey}
              textAlignVertical={'center'}
              multiline={true}
            />
            <TouchableOpacity onPress={onSubmit} style={styles.loginButton}>
              <Text style={styles.buttonText}>Copy Your Seed Phrase</Text>
              <Image
                style={styles.loginLogo}
                source={require('../../assets/copy.png')}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <Text style={styles.text}>Please enter your PIN</Text>
            <CodeField
              ref={ref}
              {...prop}
              value={value}
              onChangeText={setValue}
              autoFocus={true}
              cellCount={4}
              keyboardType="number-pad"
              textContentType="oneTimeCode"
              renderCell={renderCell}
            />
            <Pressable
              disabled={value.length !== 4}
              onPress={() => submit(value)}
              style={[
                styles.loginButton,
                {opacity: value.length !== 4 ? 0.5 : 1},
              ]}>
              <Text style={styles.buttonText}>Restore</Text>
              <Image
                style={styles.loginLogo}
                source={require('../../assets/restore.png')}
              />
            </Pressable>
          </>
        )}
      </View>
    </>
  );
};

export default BackupIdentity;
