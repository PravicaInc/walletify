import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: PADDING_HORIZONTAL,
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
  smallPusher: {
    marginTop: 20,
    marginBottom: 10,
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
  },
});

export default styles;
