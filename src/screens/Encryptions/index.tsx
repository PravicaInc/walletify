/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {HeaderComponent} from '../../components/Header';

const Encryptions: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Encryption'}
          imageSource={require('../../assets/fingerprint.png')}
        />
      </View>
    </>
  );
};

export default Encryptions;
