import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  assetGroupHeader: {
    marginTop: 27,
    marginBottom: 10,
  },
  assetsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  lastAsset: {
    marginRight: 'auto',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    marginTop: 14,
  },
  copyAddressButton: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyAddressIcon: {
    marginLeft: 5,
  },
  contentLoader: { alignSelf: 'center', marginTop: 20 },
});
