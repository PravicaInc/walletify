/* eslint-disable react-hooks/exhaustive-deps */
import {decrypt} from '@stacks/keychain';
import React, {useState} from 'react';
import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
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
        console.warn(decryptedKey);
      } else {
        throw new Error();
      }
    } catch (error) {
      setError('Invalid pin code');
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
          Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in
          laying out print, graphic or web designs
        </Text>
        <Text style={styles.text}>Please enter your pin code</Text>
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
          style={[styles.loginButton, {opacity: value.length !== 4 ? 0.5 : 1}]}>
          <Text style={styles.buttonText}>Restore</Text>
          <Image
            style={styles.loginLogo}
            source={require('../../assets/restore.png')}
          />
        </Pressable>
      </View>
    </>
  );
};

export default BackupIdentity;
