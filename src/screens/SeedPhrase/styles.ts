import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';
import {isWideScreen} from '../../utils';

export const styles = StyleSheet.create({
  container: {
    padding: 44,
    paddingVertical: isWideScreen ? 44 : 20,
    backgroundColor: 'white',
  },
  card: {
    backgroundColor: 'white',
    padding: 35,
    paddingTop: 20,
    paddingBottom: 53,
    borderRadius: 20,
  },
  imageLogo: {
    width: 155,
    height: 60,
    resizeMode: 'contain',
  },
  description: {
    color: theme.colors.black,
    fontSize: 24,
    marginTop: isWideScreen ? 40 : 16,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: '#ECF0F1',
    borderColor: '#DADCDD',
    borderWidth: 1,
    height: 200,
    borderRadius: 12,
    marginTop: 24,
    padding: 16,
    paddingTop: 16,
    fontSize: 14,
    color: 'black',
  },
  loginButton: {
    padding: 16,
    backgroundColor: theme.colors.badgeBackground,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 10,
    height: 48,
    marginTop: isWideScreen ? 50 : 0,
  },
  loginLogo: {width: 24, height: 24},
  buttonText: {color: theme.colors.white, fontSize: 14},
  seetTextRed: {color: theme.colors.danger, fontSize: 14, marginTop: 8},
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
    marginBottom: isWideScreen ? 20 : 0,
  },
});
