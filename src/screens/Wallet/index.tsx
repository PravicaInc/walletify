/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {TransactionVersion} from '@stacks/transactions';
import {HeaderComponent} from '../../components/Header';

const Wallet: React.FC = () => {
  const wallet = useSelector(selectCurrentWallet);

  useEffect(() => {
    if (wallet) {
      const stxAddress = wallet.stacksPrivateKey
        ? wallet.getSigner().getSTXAddress(TransactionVersion.Mainnet)
        : undefined;
      console.warn(stxAddress);
    }
  }, [wallet]);

  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Wallet'}
          imageSource={require('../../assets/fingerprint.png')}
        />
      </View>
    </>
  );
};

export default Wallet;
