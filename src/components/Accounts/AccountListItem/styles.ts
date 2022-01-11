import { StyleSheet } from 'react-native';

const accountListItemStyles = StyleSheet.create({
  container: {
    borderRadius: 13,
    flexDirection: 'row',
    marginVertical: 10,
    height: 60,
    padding: 7.5,
  },
  accountDetails: {
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    flex: 1,
    height: '100%',
  },
  accountNameWithAddress: {
    height: '100%',
    maxWidth: '50%',
    justifyContent: 'space-between',
    marginHorizontal: 6,
  },
  accountAddress: {
    marginRight: 'auto',
    alignSelf: 'flex-start',
  },
});

export default accountListItemStyles;
