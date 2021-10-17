import React from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

import Onboarding1 from '../../assets/onboarding1.svg';
import Onboarding2 from '../../assets/onboarding2.svg';
import Onboarding3 from '../../assets/onboarding3.svg';
import CustomButton, {
  ACTIVE_PRIMARY,
} from '../../components/shared/CustomButton';
import { MyText } from '../../components/shared/myText';
import styles from './styles';

const data = [
  {
    svg: Onboarding1,
    title: 'Manage Your Assets',
    body:
      'WISE is a mobile wallet that you can use anywhere anytime. Only you own your assets.',
  },
  {
    svg: Onboarding2,
    title: 'Manage Your Accounts',
    body:
      'To manage which account to authenticate or pay with. Each account could have its own identity.',
  },
  {
    svg: Onboarding3,
    title: 'Earn BTC',
    body:
      'You can stack your STX through WISE and earn rewards in BTC without any kind of fees.',
  },
];

type Item = typeof data[0];

const OnBoarding: React.FC = () => {
  const keyExtractor = (item: Item) => item.title;

  const renderItem = ({ item }: { item: Item }) => {
    const Img = item.svg;
    return (
      <View style={styles.slideContainer}>
        <SafeAreaView style={styles.slide}>
          <Img width="300" />
          <MyText type="bigTitle">{item.title}</MyText>
          <MyText type="commonText">{item.body}</MyText>
        </SafeAreaView>
      </View>
    );
  };

  const renderBottomButton = () => (
    <CustomButton type={ACTIVE_PRIMARY}>Get Started</CustomButton>
  );

  return (
    <View style={styles.allSlidesContainer}>
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        bottomButton
        activeDotStyle={styles.activeDotStyle}
        dotStyle={styles.dotStyle}
        data={data}
        renderNextButton={renderBottomButton}
        renderDoneButton={renderBottomButton}
      />
    </View>
  );
};

export default OnBoarding;
