import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Identity} from '@stacks/keychain';
import {useCardsIdentity} from '../hooks/useCardsIdentity';

interface Props {
  identity: Identity;
}

export const IdentityCard: React.FC<Props> = (props: Props) => {
  const {identity} = props;

  const cardIdentity = useCardsIdentity(identity.defaultUsername);

  return (
    <>
      <View
        style={[
          styles.item,
          {
            backgroundColor: cardIdentity.backgroundColor,
          },
        ]}>
        <View style={styles.scew} />
        <View>
          <Text style={styles.blockstackText}>{cardIdentity.text}</Text>
          <Text style={styles.blockstackIdText}>
            {identity.defaultUsername?.split('.')[0]}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.blockstackIdText}>
            {identity.defaultUsername?.replace(
              identity.defaultUsername?.split('.')[0],
              '',
            )}
          </Text>
          <Image source={cardIdentity.image} />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    borderRadius: 15,
    paddingTop: 36,
    paddingLeft: 25,
    paddingRight: 25,
    paddingBottom: 16,
    height: 170,
    marginBottom: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
    shadowColor: '#000000',
    shadowOffset: {height: 1, width: 0},
    shadowOpacity: 0.75,
    shadowRadius: 1,
    position: 'relative',
  },
  scew: {
    position: 'absolute',
    top: 0,
    right: '-30%',
    backgroundColor: 'rgba(255,255,255,.08)',
    width: '70%',
    height: 171,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    transform: [{skewX: '-45deg'}],
  },
  blockstackText: {
    color: '#A6A5C4',
    fontSize: 14,
  },
  blockstackIdText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
});
