import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';
import {isWideScreen} from '../../utils';

export const styles = StyleSheet.create({
  container: {
    paddingTop: isWideScreen ? 60 : 20,
    padding: 44,
    width: '100%',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  imageLogo: {
    width: 155,
    height: 60,
    resizeMode: 'contain',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ECF0F1',
    borderTopColor: '#ECF0F1',
    borderBottomWidth: 1,
    marginTop: 16,
    paddingTop: 5,
  },
  title: {
    color: '#2C3E50',
    fontSize: isWideScreen ? 24 : 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: isWideScreen ? 36 : 16,
  },
  pravicaLogo: {width: 63, height: 63, resizeMode: 'contain', marginRight: 18},
  card: {
    marginHorizontal: 16,
    backgroundColor: 'white',
    padding: 35,
    paddingTop: 42,
    paddingBottom: 53,
    borderRadius: 20,
  },
  description: {
    color: theme.colors.textGreyColor,
    fontSize: 14,
  },
  desc: {
    color: theme.colors.black,
    fontSize: 14,
    width: '75%',
  },
  loginButton: {
    padding: 8,
    backgroundColor: theme.colors.badgeBackground,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 10,
    width: '100%',
    marginTop: isWideScreen ? 35 : 16,
    height: 48,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: {height: 1, width: 0},
    shadowOpacity: 0.75,
    shadowRadius: 1,
  },
  continueButton: {
    borderColor: theme.colors.badgeBackground,
    backgroundColor: 'white',
    borderWidth: 1,
    marginTop: isWideScreen ? 35 : 16,
    height: 48,
  },
  loginLogo: {width: 24, height: 24},
  buttonText: {color: theme.colors.white, fontSize: 14},
});
