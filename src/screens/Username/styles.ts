import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#F4F4F4',
  },
  flexRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    borderBottomColor: '#ECF0F1',
    borderBottomWidth: 1,
    marginTop: 16,
    paddingBottom: 45,
  },
  title: {
    color: '#2C3E50',
    fontSize: 16,
    fontWeight: 'bold',
    width: '80%',
    marginBottom: 5,
  },
  pravicaLogo: {width: 63, height: 63, resizeMode: 'contain', marginRight: 18},
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
  desc: {
    color: theme.colors.textGreyColor,
    fontSize: 14,
    width: '50%',
  },
  loginButton: {
    padding: 16,
    backgroundColor: '#707070',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 4,
    width: '90%',
    marginTop: 45,
  },
  continueButton: {
    backgroundColor: '#E0E0E0',
    borderWidth: 1,
    marginTop: 35,
    borderColor: '#707070',
  },
  loginLogo: {width: 24, height: 24, marginRight: 9},
  buttonText: {color: theme.colors.white, fontSize: 14},
});
