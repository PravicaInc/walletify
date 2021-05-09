/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Image, Text, View} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { useNavigation } from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import {styles} from './styles';

const slides = [
  {
    key: 'wallet',
    title: 'Wallet',
    text:
      'A simple crypto wallet where you can hold and control your digital assets and NFTs',
    image: require('../../assets/app_slider/w.png'),
    icon: require('../../assets/app_slider/wallet.png'),
  },
  {
    key: 'identity',
    title: 'Identity',
    text:
      'Identify yourself to an app while retaining complete control over their credentials and personal details. ',
    image: require('../../assets/app_slider/i.png'),
    icon: require('../../assets/app_slider/identity.png'),
  },
  {
    key: 'stacks',
    title: 'Stacks',
    text:
      'Stacking rewards (STX) token holders with bitcoin for providing a valuable service to the network by locking up their tokens for a certain time.',
    image: require('../../assets/app_slider/s.png'),
    icon: require('../../assets/app_slider/stacks.png'),
  },
  {
    key: 'encryption',
    title: 'Encryption',
    text: 'Guarantees your security and privacy over your data and keys',
    image: require('../../assets/app_slider/e.png'),
    icon: require('../../assets/app_slider/key.png'),
  },
];

const IntroSlider: React.FC = () => {
  const {dispatch} = useNavigation();

  const _renderNextButton = () => {
    return <Text style={styles.done}>Next</Text>;
  };
  const _renderDoneButton = () => {
    return <Text style={styles.done}>Get Started</Text>;
  };
  const _renderItem = ({item}: {item: any}) => {
    return (
      <View style={styles.view}>
        <View
          style={{flex: 0.65, alignItems: 'center', justifyContent: 'center'}}>
          <Image style={styles.image} source={item.image} />
        </View>
        <View style={{flex: 0.35}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.title}>{item.title}</Text>
            <Image style={styles.icon} source={item.icon} />
          </View>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </View>
    );
  };
  return (
    <>
      <AppIntroSlider
        data={slides}
        renderDoneButton={_renderDoneButton}
        onDone={() => {
          AsyncStorage.setItem('appState', 'valid').then(() => {
            resetNavigation(dispatch, 'Login');
          });
        }}
        renderNextButton={_renderNextButton}
        renderItem={_renderItem}
        activeDotStyle={{backgroundColor: '#5546FF'}}
      />
    </>
  );
};

export default IntroSlider;
