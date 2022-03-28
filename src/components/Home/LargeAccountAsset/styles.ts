import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tokenCard: {
    flexDirection: 'column',
    borderRadius: 13,
    paddingVertical: 15,
    paddingHorizontal: 12,
    marginVertical: 10,
    width: '47%',
    aspectRatio: 1.1,
  },
  tokenInformationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  balanceInformationContainer: {
    marginTop: 15,
  },
  tokenIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },
  balanceValue: { marginTop: 10 },
  expandIconContainer: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 9,
    alignSelf: 'flex-end',
    marginBottom: -3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullWidth: {
    flex: 1,
  },
});
