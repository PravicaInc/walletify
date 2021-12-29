import { StyleSheet } from 'react-native';

const switchAccountButtonStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingEnd: 23,
    paddingStart: 7,
    marginBottom: 10,
    borderRadius: 13,
  },
  switchIconContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  accountInfo: {
    width: '70%',
    marginLeft: 6,
  },
  accountName: {
    width: '100%',
  },
  address: {
    paddingTop: 6,
  },
});
export default switchAccountButtonStyles;
