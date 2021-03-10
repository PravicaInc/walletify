import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    alignItems: 'center',
  },
  pravicaLogo: {width: '70%', resizeMode: 'contain'},
  card: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    padding: 35,
    paddingTop: 42,
    paddingBottom: 53,
    borderRadius: 20,
    width: '94%',
  },
  description: {
    color: theme.colors.textGreyColor,
    fontSize: 14,
  },
  loginButton: {
    padding: 16,
    backgroundColor: theme.colors.badgeBackground,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 4,
    marginTop: 50,
  },
  loginLogo: {width: 24, height: 24, marginRight: 9},
  buttonText: {color: theme.colors.white, fontSize: 14},
});
