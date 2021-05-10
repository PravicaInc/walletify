/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Text, View, Image} from 'react-native';
import {styles} from './styles';
// import {useSelector} from 'react-redux';
// import {selectCurrentWallet} from '../../store/wallet/selectors';
// import {TransactionVersion} from '@stacks/transactions';
import {HeaderComponent} from '../../components/Header';

const Wallet: React.FC = () => {
  // const wallet = useSelector(selectCurrentWallet);

  // useEffect(() => {
  //   if (wallet) {
  //     const stxAddress = wallet.stacksPrivateKey
  //       ? wallet.getSigner().getSTXAddress(TransactionVersion.Mainnet)
  //       : undefined;
  //     console.warn(stxAddress);
  //   }
  // }, [wallet]);

  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Wallet'}
          imageSource={require('../../assets/wallet.png')}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: '100%', height: 300}}
            resizeMode="contain"
            source={require('../../assets/coming-soon.png')}
          />
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              marginVertical: 20,
              textAlign: 'center',
            }}>
            Coming soon
          </Text>
          <Text style={{textAlign: 'center'}}>
            Lorem ipsum, or lipsum as it is sometimes known, is dummy text used
            in laying out print, graphic or web designs
          </Text>
        </View>
      </View>
    </>
  );
};

export default Wallet;
