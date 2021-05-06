/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {HeaderComponent} from '../../components/Header';

const Stacks: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Stacks'}
          imageSource={require('../../assets/fingerprint.png')}
        />
      </View>
    </>
  );
};

export default Stacks;
