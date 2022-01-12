import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  horizontalFill: { width: '100%' },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 13,
  },
  detailText: {
    marginBottom: 5,
  },
  separator: {
    height: 0.5,
    width: '100%',
    marginVertical: 20,
  },
  assetPreview: {
    paddingTop: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  assetName: {
    marginLeft: 'auto',
  },
  asset: {
    backgroundColor: 'transparent',
    paddingLeft: 0,
    paddingRight: 0,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
  previewCard: {
    borderRadius: 24,
    width: '100%',
    paddingHorizontal: 21,
    paddingVertical: 14,
    marginBottom: 15,
  },
  transactionDetails: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionMetadataItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '4%',
    marginVertical: 5,
  },
});
