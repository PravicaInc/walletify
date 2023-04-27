import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const PADDING_HORIZONTAL = '5%';
export const PADDING_VERTICAL = '5%';
export const CARD_ITEM_WIDTH = width - width * 0.025;

// Toast Configuration
export const TOAST_VISIBILITY_TIME = 2000;

export const useGetToastOffset = () => {
  const { top } = useSafeAreaInsets();
  return 20 + top;
};

export const useGetBottomTabsHeight = () => {
  const { bottom } = useSafeAreaInsets();
  return 50 + bottom;
};
