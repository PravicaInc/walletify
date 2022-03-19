import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  largeButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 7,
    marginBottom: 20,
    borderRadius: 13,
  },
  smallButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    width: 200,
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    marginBottom: 3,
  },
  address: {
    marginTop: 3,
  },
  none: {},
});
