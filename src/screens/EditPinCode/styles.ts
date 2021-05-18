import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
    paddingTop: 20,
    paddingBottom: 53,
    marginTop: 50,
    borderRadius: 20,
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
    fontWeight: '500',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#ECF0F1',
    height: 100,
    borderRadius: 12,
    marginTop: 24,
    padding: 16,
    paddingTop: 16,
    fontSize: 14,
    color: 'black',
  },
  loginButton: {
    padding: 16,
    backgroundColor: '#707070',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 4,
    marginTop: 50,
  },
  loginLogo: {width: 24, height: 24, marginRight: 9},
  buttonText: {color: theme.colors.white, fontSize: 14},
  seetTextRed: {color: theme.colors.danger, fontSize: 14, marginTop: 8},
  fieldRow: {
    marginTop: 10,
    flexDirection: 'row',
    marginLeft: 8,
  },
  cell: {
    width: 55,
    height: 55,
    lineHeight: 55,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 8,
    borderRadius: 12,
    borderColor: '#707070',
    borderWidth: 1,
  },
  toggle: {
    width: 55,
    height: 55,
    lineHeight: 55,
    fontSize: 24,
    textAlign: 'center',
  },
  focusCell: {
    shadowColor: '#3CA5FF',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3,

    elevation: 1,
  },
  errorTextRed: {
    color: theme.colors.danger,
    fontSize: 14,
    marginTop: 16,
    marginLeft: 16,
  },
  confirmPinCode: {
    fontSize: 14,
    color: 'black',
    fontWeight: '600',
    marginTop: 10,
  },
});
