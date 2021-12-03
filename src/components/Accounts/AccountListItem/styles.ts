import { StyleSheet } from 'react-native';

const accountListItemStyles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingLeft: 10,
  },
  accountDetails: {
    flex: 1,
  },
  accountNameWithAddress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountAddress: {
    marginStart: 10,
  },
  accountSelectedIconContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingEnd: 10,
  },
});

export default accountListItemStyles;
