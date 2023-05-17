import React, { useRef, useContext, useCallback } from 'react';
import { View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppIntroSlider from 'react-native-app-intro-slider';
import { StackActions, useNavigation } from '@react-navigation/native';
import OnBoarding1 from '../../assets/images/onBoarding/onBoarding1.svg';
import OnBoarding2 from '../../assets/images/onBoarding/onBoarding2.svg';
import OnBoarding3 from '../../assets/images/onBoarding/onBoarding3.svg';
import { Typography } from '../../components/shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
import GradientText from '../../components/shared/gradientText';

interface OnBoardingStep {
  svg: SVGElement;
  title: string;
  body: string;
}
const onBoardingSteps: OnBoardingStep[] = [
  {
    svg: <OnBoarding1 width="300" height="300" />,
    title: 'Manage Assets',
    body: 'Own your assets and pay on-the-go with Walletify - the mobile wallet for anytime, anywhere use.',
  },
  {
    svg: <OnBoarding2 width="300" height="300" />,
    title: 'Manage Accounts',
    body: 'Easily switch between payment and authentication accounts with Walletify. Plus, create as many accounts as you need - the possibilities are unlimited!',
  },
  {
    svg: <OnBoarding3 width="300" height="300" />,
    title: 'Decentralized Authentication',
    body: 'Your personal information stays private and secure, thanks to blockchain technology that eliminates the need for centralized authentication systems.',
  },
];

const OnBoarding: React.FC = () => {
  const slider = useRef<any>();
  const { dispatch } = useNavigation();
  const { setViewedOnBoarding } = useContext(UserPreferenceContext);
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const keyExtractor = useCallback((item: OnBoardingStep) => item.title, []);

  const renderItem = useCallback(({ item }: { item: OnBoardingStep }) => {
    return (
      <View style={styles.slide}>
        {item.svg}
        <GradientText style={styles.title}>
          <Typography type="bigTitle">{item.title}</Typography>
        </GradientText>
        <Typography
          type="commonText"
          style={[styles.body, { color: colors.primary40 }]}>
          {item.body}
        </Typography>
      </View>
    );
  }, []);

  const handleNext = useCallback(
    (index: number) => () => slider.current?.goToSlide(index, true),
    [],
  );

  const handleDone = useCallback(() => {
    setViewedOnBoarding(true);
    dispatch(StackActions.replace('WalletSetup'));
  }, []);

  const renderPagination = useCallback(
    (activeStep: number) => {
      const isDone = activeStep >= onBoardingSteps.length - 1;

      return (
        <View style={styles.paginationContainer}>
          <View style={styles.paginationDots}>
            {onBoardingSteps.length > 1 &&
              onBoardingSteps.map((_, stepIndex) => (
                <TouchableOpacity
                  key={stepIndex}
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        stepIndex === activeStep
                          ? colors.primary100
                          : colors.primary10,
                    },
                  ]}
                  onPress={handleNext(stepIndex)}
                />
              ))}
          </View>
          {isDone && (
            <TouchableHighlight
              underlayColor={colors.primary60}
              onPress={handleDone}
              style={[
                styles.button,
                {
                  backgroundColor: colors.primary100,
                },
              ]}>
              <Typography type="buttonText" style={{ color: colors.white }}>
                Get Started
              </Typography>
            </TouchableHighlight>
          )}
        </View>
      );
    },
    [colors, handleDone],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        bottomButton
        data={onBoardingSteps}
        renderPagination={renderPagination}
        ref={slider}
      />
    </SafeAreaView>
  );
};

export default OnBoarding;
