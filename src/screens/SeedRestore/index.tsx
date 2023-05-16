import React, { useCallback, useContext, useMemo, useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackActions, useNavigation } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { Typography } from '../../components/shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import { RootStackParamList } from '../../navigation/types';
import styles from './styles';
import Animated from 'react-native-reanimated';
import PasswordShield from '../../assets/password-shield.svg';
import { useKeyboardWithAnimation } from '../../hooks/common/useKeyboardWithAnimation';
import SeedPhraseGrid from '../../components/SeedPhraseGrid';
import { useWallet } from '../../hooks/useWallet/useWallet';
import { isIosApp } from '../../shared/helpers';
import GeneralButton from '../../components/shared/GeneralButton';

type Props = NativeStackScreenProps<RootStackParamList, 'SeedRestore'>;

const SeedRestore: React.FC<Props> = ({
  route: {
    params: { password },
  },
}) => {
  const { dispatch } = useNavigation();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const animatedStyles = useKeyboardWithAnimation();
  const { restoreWallet } = useWallet();
  const [seedPhrase, setSeedPhrase] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = useCallback(async () => {
    setLoading(true);
    await restoreWallet(seedPhrase, password);
    dispatch(StackActions.replace('Home'));
    setLoading(false);
  }, [password, seedPhrase]);

  const handleGoBack = useCallback(() => dispatch(StackActions.pop()), []);
  const canGoNext = useMemo(() => {
    const phraseLength = seedPhrase.split(' ').length;
    return phraseLength === 12 || phraseLength === 24;
  }, [seedPhrase]);
  const ctaButton = (
    <GeneralButton
      loading={loading}
      canGoNext={canGoNext}
      onClick={handleContinue}
      text={'Continue'}
    />
  );
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.defaultBlack }]}>
      <Header
        containerStyles={styles.header}
        leftComponent={
          <HeaderBack onPress={handleGoBack} text="Back" hasChevron />
        }
        rightComponent={isIosApp && ctaButton}
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.scrollableContent}>
          <View style={styles.smallPusher}>
            <Animated.View style={[styles.hiddenItems, animatedStyles]}>
              <PasswordShield />
              <Typography type="bigTitle" style={styles.title}>
                Enter Your Secret Key
              </Typography>
              <Typography
                type="commonText"
                style={[styles.description, { color: colors.textColor }]}>
                You can either enter it word by word or just paste it in the
                first input and it will work.
              </Typography>
            </Animated.View>
          </View>
          <SeedPhraseGrid
            isEditable
            phrase={seedPhrase}
            setPhrase={setSeedPhrase}
          />
          {!isIosApp && ctaButton}
          <View style={styles.pusher} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SeedRestore;
