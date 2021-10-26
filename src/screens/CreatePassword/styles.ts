import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    marginBottom: PADDING_VERTICAL,
    paddingHorizontal: PADDING_HORIZONTAL,
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
    marginBottom: 24,
    flex: undefined,
    height: 60,
  },
  topInput: { marginBottom: 0 },

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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginTop: 20,
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
