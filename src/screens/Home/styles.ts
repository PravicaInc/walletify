import { StyleSheet } from 'react-native';
import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    shadowOpacity: 0,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
