import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  headerText: {
    fontSize: 24,
    marginVertical: 20,
    color: theme.colors.black,
    fontWeight: 'bold',
  },
  blockstackText: {
    color: 'white',
    fontSize: 20,
  },
  blockstackIdText: {
    color: 'white',
    fontSize: 18,
    marginBottom: 28,
  },
  centeredView: {
    flex: 1,
    paddingTop: 40,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    paddingVertical: 35,
  },
  loginButton: {
    padding: 16,
    backgroundColor: '#FFE6E3',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E74C3C',
    marginBottom: 20,
  },
  loginLogo: {width: 24, height: 24, marginRight: 9},
  buttonText: {color: '#E74C3C', fontSize: 16, fontWeight: 'bold'},
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
    width: '80%',
    alignItems: 'center',
  },
  imageContainer: {
    width: 83,
    height: 83,
    borderRadius: 41.5,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  image: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
    borderRadius: 36,
  },
  warningText: {fontWeight: 'bold', fontSize: 16, color: 'white'},
  flatlist: {
    width: '100%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 20,
    marginTop: 20,
    maxHeight: '75%',
  },
  cancel: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});
