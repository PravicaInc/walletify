import { StyleSheet } from 'react-native';
import { PADDING_HORIZONTAL } from '../../../shared/layout';

export default StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
  },
  contentViewContainer: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  fullWidth: {
    flex: 1,
    width: '100%',
  },
  confirm: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollableContent: {
    alignItems: 'center',
    justifyContent: 'space-around',
    flexGrow: 1,
    paddingVertical: 50,
  },
  input: {
    height: 60,
  },
  hiddenItems: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  pusher: {
    marginTop: 'auto',
  },
  contentHeader: {
    marginTop: 16,
    marginBottom: 9,
  },
  description: {
    marginBottom: 40,
    width: '80%',
    textAlign: 'center',
    lineHeight: 15,
  },
  warningIcon: {
    marginBottom: 7,
  },
  warningText: {
    textAlign: 'center',
    width: '80%',
  },
});
