import { StyleSheet } from 'react-native';
import { PADDING_HORIZONTAL } from '../../shared/layout';

const loginStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentViewContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  screenHeader: {
    shadowOpacity: 0,
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
  passwordInputFieldContainer: {
    width: '100%',
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  passwordInputFieldLabel: {
    alignSelf: 'center',
  },
  passwordInputField: {
    height: 60,
  },
  passwordErrorMessage: {
    paddingLeft: 10,
  },
  warningContainer: {
    alignItems: 'center',
    marginBottom: '10%',
  },
  warningIcon: {
    marginBottom: 7,
  },
  warningText: {
    textAlign: 'center',
    width: '80%',
  },
});
export default loginStyles;
