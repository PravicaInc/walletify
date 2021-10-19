import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
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
