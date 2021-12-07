import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  back: {
    marginLeft: PADDING_HORIZONTAL,
  },
  pusher: {
    marginTop: 'auto',
  },
  hiddenItems: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollableContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: { marginVertical: 10 },
  description: {
    textAlign: 'center',
    width: '80%',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    height: 60,
    marginBottom: 10,
  },
});

export default styles;
