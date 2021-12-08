import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const PADDING_HORIZONTAL = '2.5%';
export const PADDING_VERTICAL = '2.5%';
export const CARD_ITEM_WIDTH = width - width * 0.025;

export const useGetBottomTabsHeight = () => {
  const { bottom } = useSafeAreaInsets();
  return 50 + bottom;
};
