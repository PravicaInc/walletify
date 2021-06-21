/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Text, View, Image} from 'react-native';
import {styles} from './styles';
import {HeaderComponent} from '../../components/Header';

const Wallet: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Wallet'}
          imageSource={require('../../assets/wallet.png')}
        />
        <View style={styles.view}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/coming-soon.png')}
          />
          <Text style={styles.text}>Don't let this fall off your plate</Text>
          <Text style={styles.textAlign}>Stay tuned!</Text>
        </View>
      </View>
    </>
  );
};

export default Wallet;
