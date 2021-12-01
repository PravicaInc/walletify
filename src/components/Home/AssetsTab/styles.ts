import { StyleSheet } from 'react-native';

const assetsTabStyles = StyleSheet.create({
  assetsList: {
    flex: 1,
  },
  assetsListContent: {
    flexGrow: 1,
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
export default assetsTabStyles;
