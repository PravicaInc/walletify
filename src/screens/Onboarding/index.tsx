import React, { useRef, useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StackActions, useNavigation } from '@react-navigation/native';

import Onboarding1 from '../../assets/onboarding1.svg';
import Onboarding2 from '../../assets/onboarding2.svg';
import Onboarding3 from '../../assets/onboarding3.svg';
import CustomButton from '../../components/shared/CustomButton';
import { MyText } from '../../components/shared/myText';
import { ThemeContext } from '../../contexts/theme';
import styles from './styles';

const data = [
  {
    svg: Onboarding1,
    title: 'Manage Your Assets',
    body: 'WISE is a mobile wallet that you can use anywhere anytime. Only you own your assets.',
  },
  {
    svg: Onboarding2,
    title: 'Manage Your Accounts',
    body: 'To manage which account to authenticate or pay with. Each account could have its own identity.',
  },
  {
    svg: Onboarding3,
    title: 'Earn BTC',
    body: 'You can stack your STX through WISE and earn rewards in BTC without any kind of fees.',
  },
];

type Item = typeof data[0];

const OnBoarding: React.FC = () => {
  const slider = useRef<any>();

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { dispatch } = useNavigation();

  const keyExtractor = (item: Item) => item.title;

  const renderItem = ({ item }: { item: Item }) => {
    const Img = item.svg;
    return (
      <View style={styles.slide}>
        <Img width="300" />
        <MyText type="bigTitle" style={styles.title}>
          {item.title}
        </MyText>
        <MyText type="commonText" style={styles.body}>
          {item.body}
        </MyText>
      </View>
    );
  };

  const renderPagination = (activeIndex: number) => {
    const isDone = activeIndex >= data.length - 1;

    const handleNext = (index: number) => () =>
      slider.current?.goToSlide(index, true);

    const handleDone = () => dispatch(StackActions.replace('Home'));

    return (
      <View style={styles.paginationContainer}>
        <View style={styles.paginationDots}>
          {data.length > 1 &&
            data.map((_, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.inactive },
                ]}
                onPress={handleNext(i)}
              />
            ))}
        </View>
        <CustomButton
          type={isDone ? 'activePrimary' : 'inactivePrimary'}
          onPress={isDone ? handleDone : undefined}>
          Get Started
        </CustomButton>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        bottomButton
        data={data}
        renderPagination={renderPagination}
        ref={slider}
      />
    </SafeAreaView>
  );
};

export default OnBoarding;
