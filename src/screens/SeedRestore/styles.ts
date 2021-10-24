import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollableContent: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: PADDING_VERTICAL,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  topContent: {
    alignItems: 'center',
    flex: 0.75,
    width: '100%',
    justifyContent: 'center',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center' },
  bottomContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
  },
  seedTitle: { marginVertical: 10 },
  seedInputContainer: {
    height: '50%',
    width: '100%',
  },
  seedInput: {
    paddingVertical: 10,
    textAlignVertical: 'top',
  },
});

export default styles;
