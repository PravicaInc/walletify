import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  logo: {width: 88, height: 88},
  bottomText: {
    position: 'absolute',
    fontSize: 20,
    bottom: 30,
    color: theme.colors.white,
  },
  pravicaText: {color: theme.colors.primary, fontWeight: 'bold'},
});