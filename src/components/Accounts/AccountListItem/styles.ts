import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
  button: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonText: {
    marginLeft: 5,
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
