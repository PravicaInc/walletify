/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Identity} from '@stacks/keychain';

interface Props {
  identity: Identity;
  firstBitcoinAddress: string;
}
export const IdentityCard: React.FC<Props> = (props: Props) => {
  const {identity, firstBitcoinAddress} = props;
  return (
    <>
      <View style={styles.item}>
        <Text style={styles.blockstackIdText}>{identity.defaultUsername}</Text>
        <View style={styles.adresses}>
          <Image source={require('../assets/stacks.png')} style={styles.icon} />
          <Text style={styles.address}>{identity.address}</Text>
        </View>
        <View style={styles.adresses}>
          <Image
            source={require('../assets/bitcoin.png')}
            style={styles.icon}
          />
          <Text style={styles.address}>{firstBitcoinAddress}</Text>
        </View>
      </View>
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
  blockstackText: {
    color: 'black',
    fontSize: 14,
  },
  blockstackIdText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 28,
  },
  adresses: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  icon: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginRight: 10,
  },
  address: {
    color: '#2C3E50',
    fontSize: 13,
  },
});
