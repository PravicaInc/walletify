import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  pravicaLogo: {width: '50%', resizeMode: 'contain'},
  imageHeader: {
    width: 90,
    height: 80,
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    padding: 35,
    paddingTop: 50,
    paddingBottom: 53,
    borderRadius: 20,
    marginTop: 50,
  },
  description: {
    color: '#7F8C8D',
    fontSize: 12,
    fontWeight: '500',
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
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
  },
  textInput: {
    backgroundColor: '#E0E0E0',
    height: 112,
    justifyContent:'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    borderRadius: 15,
    marginTop: 24,
    padding: 16,
    paddingTop: 16,
    fontSize: 14,
    color: '#707070',
  },
  loginButton: {
    padding: 16,
    backgroundColor: '#707070',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 4,
    width: '90%',
    marginLeft: '5%',
    marginTop: 30,
  },
  loginLogo: {width: 24, height: 24, marginRight: 9},
  buttonText: {color: theme.colors.white, fontSize: 14, fontWeight: 'bold'},
  seetTextRed: {color: theme.colors.danger, fontSize: 14, marginTop: 8},
});
