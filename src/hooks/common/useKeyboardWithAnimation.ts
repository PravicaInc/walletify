import { useKeyboard } from '@react-native-community/hooks';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export const useKeyboardWithAnimation = () => {
  const { keyboardShown } = useKeyboard();
  const offset = useSharedValue(0);
  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: offset.value,
      height: offset.value * 220,
    };
  });

  useEffect(() => {
    if (!keyboardShown) {
      offset.value = withTiming(1, {
        duration: 150,
      });
    } else {
      offset.value = withTiming(0, {
        duration: 150,
      });
    }
  }, [keyboardShown]);

  return animatedStyles;
};
