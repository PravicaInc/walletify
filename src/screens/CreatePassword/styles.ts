import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    marginTop: PADDING_VERTICAL,
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
  title: { marginVertical: 10 },
  description: { textAlign: 'center', marginBottom: 40 },
  input: {
    width: '90%',
    marginTop: 8,
    marginBottom: 24,
    flex: undefined,
    height: 60,
  },
  bottomInput: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },
  passwordStrength: {
    flexDirection: 'row',
    marginLeft: '5%',
    alignSelf: 'flex-start',
    width: '40%',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  button: {
    marginTop: 'auto',
  },
});

export default styles;
