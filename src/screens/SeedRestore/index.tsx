import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
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
  const [seedPhrase, setSeedPhrase] = useState('');

  const handleContinue = useCallback(async () => {
    dispatch(
      StackActions.replace('Home', {
        password,
        seedPhrase,
      }),
    );
  }, [password, seedPhrase]);

  const handleGoBack = useCallback(() => dispatch(StackActions.pop()), []);
  const canGoNext = useMemo(() => {
    const phraseLength = seedPhrase.split(' ').length;
    return phraseLength === 12 || phraseLength === 24;
  }, [seedPhrase]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
      <Header
        leftComponent={
          <HeaderBack
            customStyle={styles.back}
            onPress={handleGoBack}
            text="Back"
            hasChevron
          />
        }
      />
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={10}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          contentContainerStyle={styles.scrollableContent}>
          <View style={styles.pusher}>
            <Animated.View style={[styles.hiddenItems, animatedStyles]}>
              <PasswordShield />
              <Typography type="bigTitle" style={styles.title}>
                Enter Your Seed Phrase
              </Typography>
              <Typography
                type="commonText"
                style={[styles.description, { color: colors.primary60 }]}>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industryLorem Ipsum has beenLorem
              </Typography>
            </Animated.View>
          </View>
          <SeedPhraseGrid
            isEditable
            phrase={seedPhrase}
            setPhrase={setSeedPhrase}
          />
          <TouchableOpacity
            onPress={handleContinue}
            disabled={!canGoNext}
            style={[
              styles.button,
              styles.pusher,
              {
                backgroundColor: canGoNext
                  ? colors.primary100
                  : colors.primary20,
              },
            ]}>
            <Typography type="buttonText" style={{ color: colors.white }}>
              Continue
            </Typography>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SeedRestore;
