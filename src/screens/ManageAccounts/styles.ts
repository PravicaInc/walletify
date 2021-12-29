import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContentContainer: {
    flexShrink: 1,
    paddingHorizontal: '2.5%',
    paddingBottom: 12,
  },
  createIdentityButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createIdentityButtonText: {
    paddingStart: 5,
  },
  accountsListTitle: {
    marginTop: 22,
    marginBottom: 12,
  },
  accountsList: {
    paddingBottom: 10,
  },
  addAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  addAccountButtonText: {
    paddingStart: 5,
  },
});

export default styles;
