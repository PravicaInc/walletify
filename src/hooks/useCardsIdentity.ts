import {useMemo} from 'react';

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
        text: 'STX ID',
      };
    } else if (username?.split('.').length === 2) {
      return {
        backgroundColor: 'black',
        image: require('../assets/business.png'),
        text: 'Short ID',
      };
    }
    return {
      backgroundColor: 'red',
    };
  }, [username]);
};
