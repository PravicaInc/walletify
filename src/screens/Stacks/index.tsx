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

export default Stacks;
