import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: PADDING_VERTICAL,
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  progress: { marginTop: '5%' },
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
  description: {
    textAlign: 'center',
    marginBottom: 40,
    marginHorizontal: '6%',
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
  bottomInput: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  switchGroupContainer: { width: '100%', marginVertical: 20 },
  switchTop: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: { flex: 0.72 },
  fingerprintContainer: {
    flex: 0.08,
  },
  switch: { flex: 0.2, alignItems: 'flex-end' },
  switchBottom: {
    width: '100%',
    flexDirection: 'row',
  },
  switchDescription: {
    flex: 0.72,
  },
  button: {
    marginTop: 'auto',
  },
});

export default styles;
