import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  scrollableContent: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: PADDING_VERTICAL,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
  },
  keyboardContainer: {
    flex: 1,
  },
  shield: {
    marginTop: 'auto',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center', marginBottom: 40 },
  input: {
    width: '90%',
    marginVertical: 8,
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
