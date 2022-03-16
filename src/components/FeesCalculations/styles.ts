import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  separator: {
    width: '100%',
    height: 0.5,
    marginVertical: 32,
  },
  calculationWrapper: { flexDirection: 'row', alignItems: 'center' },
  changeFeesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  feesWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calculationText: { marginLeft: 5 },
  feeLevel: { marginLeft: 'auto', marginTop: 5 },
});
