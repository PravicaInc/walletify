import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  transactionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 13,
    paddingVertical: 12,
    paddingLeft: 8,
    paddingRight: 12,
    marginBottom: 10,
  },
  transactionInformationContainer: {
    flexDirection: 'column',
    flex: 0.9,
  },
  tokenIconContainer: {
    position: 'relative',
  },
  transactionIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 6,
  },
});
