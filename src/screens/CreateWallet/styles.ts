import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';
import {isWideScreen} from '../../utils';

export const styles = StyleSheet.create({
  container: {
    padding: 44,
    paddingTop: isWideScreen ? 70 : 30,
    backgroundColor: 'white',
  },
  pravicaLogo: {width: '50%', resizeMode: 'contain'},
  imageHeader: {
    resizeMode: 'contain',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 35,
    paddingTop: 20,
    paddingBottom: 53,
    borderRadius: 20,
    marginTop: 50,
  },
  description: {
    color: 'black',
    fontSize: 14,
    opacity: 0.5,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
  },
  image: {
    width: 57,
    height: 57,
    marginRight: 20,
    resizeMode: 'contain',
  },
  title: {
    color: theme.colors.black,
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 18,
  },
  textInput: {
    backgroundColor: '#E0E0E0',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    borderRadius: 15,
    marginTop: 12,
    padding: 16,
    paddingTop: 16,
    fontSize: 14,
    color: 'black',
  },
  loginButton: {
    padding: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.badgeBackground,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 10,
    width: '100%',
    marginTop: 30,
    height: 48,
  },
  loginLogo: {width: 24, height: 24},
  buttonText: {color: theme.colors.white, fontSize: 14, fontWeight: 'bold'},
  seetTextRed: {color: theme.colors.danger, fontSize: 14, marginTop: 8},
});
