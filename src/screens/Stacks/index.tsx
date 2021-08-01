/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Image, Text, View} from 'react-native';
import {styles} from './styles';
import {HeaderComponent} from '../../components/Header';

const Stacks: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Stacks'}
          imageSource={require('../../assets/stacks-logo.png')}
        />
        <View style={styles.view}>
          <Image
            style={styles.image}
            resizeMode="contain"
            source={require('../../assets/coming-soon.png')}
          />
          <Text style={styles.text}> Concentrate on the job in hand</Text>
          <Text style={styles.textAlign}>Stay tuned!</Text>
        </View>
      </View>
    </>
  );
};

export default Stacks;
