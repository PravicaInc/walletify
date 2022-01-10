import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  horizontalFill: { width: '100%' },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 13,
  },
  previewCard: {
    borderRadius: 24,
    width: '100%',
    paddingHorizontal: 21,
    paddingVertical: 14,
  },
  transactionDetails: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  transactionMetadataItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
});
