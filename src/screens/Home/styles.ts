import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pravicaLogo: {width: '50%', resizeMode: 'contain'},
  logoutButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  logoutLogo: {width: 24, height: 24, resizeMode: 'contain', marginLeft: 10},
  buttonText: {color: theme.colors.white, fontSize: 14, fontWeight: '700'},
  topHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    flexDirection: 'row',
  },
  sheetContainer: {
    backgroundColor: theme.colors.white,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontSize: 24,
    marginBottom: 16,
    color: theme.colors.black,
  },
  item: {
    borderRadius: 9,
    padding: 20,
    borderWidth: 1,
    backgroundColor: '#EAEAEA',
    borderColor: '#D5D5D5',
    marginBottom: 16,
  },
  blockstackText: {
    color: 'black',
    fontSize: 20,
  },
  blockstackIdText: {
    color: 'black',
    fontSize: 18,
    marginBottom: 28,
  },
  adresses: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  icon: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginRight: 10,
  },
  address: {
    color: '#2C3E50',
    fontSize: 13,
  },
  centeredView: {
    flex: 1,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    paddingVertical: 35,
    flex: 1,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
