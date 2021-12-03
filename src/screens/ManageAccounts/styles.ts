import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContentContainer: {
    paddingHorizontal: '2.5%',
  },
  createIdentityButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createIdentityButtonText: {
    paddingStart: 5,
  },
  accountsListTitle: {
    paddingVertical: 12,
  },
  accountsList: {
    paddingVertical: 10,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginVertical: 20,
  },
  addAccountButtonText: {
    paddingStart: 5,
  },
});

export default styles;
