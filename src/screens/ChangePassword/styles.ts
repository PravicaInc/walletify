import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    shadowOpacity: 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollableContent: {
    paddingHorizontal: PADDING_HORIZONTAL,
    paddingBottom: PADDING_VERTICAL,
    alignItems: 'center',
    justifyContent: 'flex-start',
    minHeight: '100%',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center', marginBottom: 40 },

  input: {
    width: '90%',
    marginTop: 8,
    marginBottom: 0,
    flex: undefined,
    height: 60,
  },

  passwordStrength: {
    flexDirection: 'row',
    marginLeft: '5%',
    alignSelf: 'flex-start',
    width: '40%',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  inputContainer: {
    width: '95%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default styles;
