import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  assetsList: {
    flex: 1,
    paddingTop: 20,
  },
  assetsListContent: {
    flexGrow: 1,
    paddingBottom: 20,
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
});
