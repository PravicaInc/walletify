import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';
import { isWideScreen } from '../../utils';

export const styles = StyleSheet.create({
  headerText: {
    fontSize: isWideScreen ? 20 : 14,
    color: theme.colors.black,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  blockstackText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: isWideScreen ? 20 : 8,
  },
  blockstackIdText: {
    color: 'white',
    fontSize: 18,
    marginVertical: 28,
  },
  centeredView: {
    paddingVertical: 40,
    paddingTop: 50,
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  modalView: {
    paddingVertical: 35,
    alignItems: 'center',
  },
  loginButton: {
    padding: 16,
    backgroundColor: '#FFE6E3',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    width: '100%',
    borderColor: '#FF0000',
    marginBottom: isWideScreen ? 20 : 10,
  },
  loginLogo: {width: 24, height: 24},
  buttonText: {color: '#FF0000', fontSize: 16, fontWeight: 'bold'},
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  contentWarning: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '90%',
    alignItems: 'center',
  },
  imageContainer: {
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    marginRight: 10,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginTop: -50,
  },
  warningText: {
    marginTop: 10,
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },
  flatlist: {
    width: '100%',
    marginTop: 20,
    height: '60%',
  },
  cancel: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});
