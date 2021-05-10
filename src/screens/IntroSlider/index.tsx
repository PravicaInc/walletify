/* eslint-disable react-hooks/exhaustive-deps */
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Image, Text, View} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import {styles} from './styles';

const slides = [
  {
    key: 'wallet',
    title: 'Wallet',
    text:
      'Wallet that holds digital assets including cryptocurrencies such as Bitcoin, STX  as well as NFTs.',
    image: require('../../assets/app_slider/w.png'),
    icon: require('../../assets/app_slider/wallet.png'),
  },
  {
    key: 'identity',
    title: 'Identity',
    text:
      'Identity management system that generates, holds, restores and authenticates BNS names within any Stacks dApp.',
    image: require('../../assets/app_slider/i.png'),
    icon: require('../../assets/app_slider/identity.png'),
  },
  {
    key: 'stacks',
    title: 'Stacks',
    text:
      'Empowers Stacks ecosystem with tools and services to accelerate user adoption and increasing Stacks customer base.',
    image: require('../../assets/app_slider/s.png'),
    icon: require('../../assets/app_slider/stacks.png'),
  },
  {
    key: 'encryption',
    title: 'Encryption',
    text:
      'End-to-end encryption of all operations and processes are done on the client-side. Not your keys, Not your assets.',
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
