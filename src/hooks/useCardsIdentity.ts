import {useMemo} from 'react';
import {Identity} from '@stacks/keychain';

const BTC = 'btc';
const BLOCKSTACK = 'blockstack';
const STX = 'stx';

export const useCardsIdentity = (username?: string) => {
  return useMemo(() => {
    if (username?.includes(BTC)) {
      return {
        backgroundColor: '#FF9F2C',
        image: require('../assets/bitcoinn.png'),
        text: 'BTC ID',
      };
    } else if (username?.includes(BLOCKSTACK)) {
      return {
        backgroundColor: '#211F6D',
        image: require('../assets/blockstack.png'),
        text: 'Blockstack ID',
      };
    } else if (username?.includes(STX)) {
      return {
        backgroundColor: '#5546FF',
        image: require('../assets/stack.png'),
        text: 'Stacks ID',
      };
    } else if (username?.split('.').length === 2) {
      return {
        backgroundColor: 'black',
        image: require('../assets/business.png'),
        text: 'Short ID',
      };
    }
    return {
      backgroundColor: '#F85A2E',
      image: require('../assets/identity.png'),
      text: 'Generic ID',
    };
  }, [username]);
};

export const sortIdentities = (ids: Identity[]) =>
  ids
    .map((val) => ({
      ...val,
      orderIndex:
        val.defaultUsername?.split('.').length === 2
          ? 2
          : val.defaultUsername?.includes(STX)
          ? 1
          : 0,
    }))
    .sort((a, b) => b.orderIndex - a.orderIndex) as any;
