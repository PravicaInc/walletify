import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    paddingHorizontal: '2.5%',
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingTop: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    marginTop: 20,
  },
  description: {
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: '5%',
  },
  inputHeader: {
    marginTop: 40,
  },
  userNameInputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderWidth: 1,
    borderRadius: 13,
    marginTop: 16,
  },
  usernameInput: {
    flex: 1,
    height: 60,
    paddingHorizontal: '5%',
  },
  userNameInputSuffix: {
    marginEnd: 16,
  },
  userNameErrorContainer: {
    paddingHorizontal: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  userNameErrorIcon: {
    marginEnd: 3,
  },
});
