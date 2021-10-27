import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingVertical: PADDING_VERTICAL,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    shadowOpacity: 0,
  },
  topContent: {
    alignItems: 'center',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center' },
  bottomContent: {
    alignItems: 'center',
  },
  seedTitle: { marginVertical: 10 },
});

export default styles;
