import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: PADDING_VERTICAL,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollableContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
    paddingTop: '15%',
  },
  title: { marginVertical: 10 },
  inputContainer: {
    width: '100%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  inputWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '99%',
    marginTop: 8,
    flex: undefined,
    height: 60,
  },
  inputGuide: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  caution: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordStrength: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  confirmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
