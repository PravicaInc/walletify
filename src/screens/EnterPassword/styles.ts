import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: PADDING_VERTICAL,
  },
  header: {
    shadowOpacity: 0,
  },
  contentContainer: {
    flex: 1,
  },
  scrollableContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
  },
  keyboardContainer: {
    flex: 1,
  },
  shield: {
    marginTop: '10%',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center', marginBottom: 40 },
  input: {
    width: '99%',
    marginVertical: 8,
    flex: undefined,
    height: 60,
  },
});

export default styles;
