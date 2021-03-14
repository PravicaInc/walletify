import React from 'react';
import {TouchableOpacity, StyleSheet, Text} from 'react-native';
import {Identity} from '@stacks/keychain';
import {doFinishSignIn} from '../store/onboarding/actions';
import {useDispatch} from 'react-redux';

interface Props {
  identity: Identity;
  identityIndex: number;
}
export const UsernameCard: React.FC<Props> = (props: Props) => {
  const {identity, identityIndex} = props;
  const dispatch = useDispatch();

  return (
    <>
      <TouchableOpacity
        onPress={() => dispatch(doFinishSignIn({identityIndex}))}
        style={styles.item}>
        <Text style={styles.blockstackIdText}>{identity.defaultUsername}</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 9,
    padding: 20,
    borderWidth: 1,
    backgroundColor: '#EAEAEA',
    borderColor: '#D5D5D5',
    marginBottom: 16,
  },
  blockstackIdText: {
    color: 'black',
    fontSize: 18,
  },
});
