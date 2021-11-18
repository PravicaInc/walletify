import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, MARGIN_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: MARGIN_VERTICAL,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollableContent: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
    paddingTop: '20%',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center', marginBottom: 40 },
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
  bottomInput: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  switchLabelContainer: {
    flexDirection: 'row',
  },
  switchLabelIcon: { marginRight: 10 },
  button: {
    marginTop: 'auto',
  },
});

export default styles;
