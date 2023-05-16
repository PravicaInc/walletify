import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { textAlign: 'center', marginBottom: 45, marginTop: 40 , color:'white',},
  stacksIllustrationContainer: {
    width: '80%',
    height: '40%',
    marginTop: 85,
  },
  stacksIllustration: {
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    height: 60,
    marginTop: 15,
  },
  buttonBorder: {
    borderWidth: 1,
  },
});
