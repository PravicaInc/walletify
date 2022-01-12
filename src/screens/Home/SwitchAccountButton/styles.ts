import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 7,
    marginBottom: 20,
    borderRadius: 13,
  },
  switchIconContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
  },
  switchText: {
    marginRight: 3,
  },
  accountInfo: {
    flex: 1,
    marginLeft: 6,
  },
  accountName: {
    width: '100%',
  },
  address: {
    paddingTop: 6,
  },
});
