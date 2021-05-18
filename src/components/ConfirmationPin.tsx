/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  CodeField,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {decrypt, Wallet} from '@stacks/keychain';

interface Props {
  onSubmit: (password: string) => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  wallet: Wallet;
}
export const ConfirmationPin: React.FC<Props> = (props: Props) => {
  const [value, setValue] = useState('');
  const ref = useBlurOnFulfill({value, cellCount: 4});
  const [prop, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });
  const [err, setError] = useState('');

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
      const decryptedKey = await decrypt(
        props.wallet?.encryptedBackupPhrase,
        text,
      );
      if (decryptedKey) {
        props.onSubmit(text);
      } else {
        throw new Error();
      }
    } catch (error) {
      setError('Invalid pin code');
    }
  };

  return (
    <>
      <View
        style={[styles.centeredView, {backgroundColor: 'rgba(0, 0, 0, 0.5'}]}>
        <Modal
          animationType="slide"
          style={{backgroundColor: 'red'}}
          visible={props.showModal}
          transparent={true}
          onRequestClose={() => {
            props.setShowModal(!props.showModal);
          }}>
          <View style={[styles.centeredView]}>
            <View
              style={{backgroundColor: '#fff', padding: 20, borderRadius: 20}}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => props.setShowModal(!props.showModal)}>
                <Image
                  style={styles.close}
                  source={require('../assets/close.png')}
                />
              </TouchableOpacity>
              <Text style={styles.text}>Please enter your pin code</Text>
              <CodeField
                ref={ref}
                {...prop}
                value={value}
                onChangeText={(text) => {
                  setError('');
                  setValue(text);
                  if (text.length === 4) {
                    submit(text);
                  }
                }}
                autoFocus={true}
                cellCount={4}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={renderCell}
              />
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 1,
  },
  container: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 16,
    paddingTop: 30,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
  err: {
    color: '#FE3939',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
  },
  close: {
    height: 25,
    width: 25,
    alignSelf: 'flex-end',
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  loginButton: {
    padding: 16,
    backgroundColor: '#707070',
    width: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 4,
    marginTop: 50,
  },
  buttonText: {color: 'white', fontSize: 14},
  cell: {
    width: 55,
    height: 55,
    lineHeight: 55,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 8,
    borderRadius: 12,
    borderColor: '#707070',
    borderWidth: 1,
  },
  focusCell: {
    shadowColor: '#3CA5FF',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3,

    elevation: 1,
  },
  errCell: {
    borderColor: '#FE3939',
  },
});
