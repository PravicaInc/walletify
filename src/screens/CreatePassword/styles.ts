import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  hiddenItems: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    marginTop: 22,
    marginHorizontal: PADDING_HORIZONTAL,
    width: '95%',
  },
  back: {
    marginLeft: PADDING_HORIZONTAL,
  },
  keyboardContainer: {
    flex: 1,
    paddingHorizontal: PADDING_HORIZONTAL,
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
  input: {
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
    marginTop: 15,
  },
  switchGroupContainer: { width: '100%', marginTop: 10 },
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
  pusher: {
    marginTop: 'auto',
  },
  smallPusher: {
    marginTop: 20,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    height: 60,
    marginBottom: 10,
  },
  confirmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadow: {
    width: 27,
    height: 27,
    borderRadius: 13.5,
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
});

export default styles;
