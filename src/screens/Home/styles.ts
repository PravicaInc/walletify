import {Platform, StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 44,
    paddingTop: Platform.OS === 'ios' ? 64 : 32,
    paddingHorizontal: 28,
    backgroundColor: 'white',
  },
  logoutButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  logoutLogo: {width: 24, height: 24, resizeMode: 'contain', marginRight: 22},
  buttonText: {color: theme.colors.white, fontSize: 14, fontWeight: '700'},
  topHeader: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },
  sheetContainer: {
    backgroundColor: theme.colors.white,
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerText: {
    fontSize: 30,
    marginBottom: 21,
    marginTop: 8,
    fontWeight: 'bold',
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
  text: {
    color: '#707070',
    fontSize: 20,
    marginLeft: 10,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: '#D0D2D2',
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
});
