/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Image, Text, View} from 'react-native';
import {styles} from './styles';
import {HeaderComponent} from '../../components/Header';
import {isWideScreen} from '../../utils';

const Stacks: React.FC = () => {
  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Stacks'}
          imageSource={require('../../assets/stacks-logo.png')}
        />
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Image
            style={{width: '100%', height: isWideScreen ? 300 : 180}}
            resizeMode="contain"
            source={require('../../assets/coming-soon.png')}
          />
          <Text
            style={{
              fontSize: 22,
              fontWeight: 'bold',
              marginVertical: 20,
              textAlign: 'center',
            }}>
            Concentrate on the job in hand
          </Text>
          <Text style={{textAlign: 'center'}}>Stay tuned!</Text>
        </View>
      </View>
    </>
  );
};

export default Stacks;
