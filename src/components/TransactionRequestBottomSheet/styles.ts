import { StyleSheet } from 'react-native';

const authenticationBottomSheetStyles = StyleSheet.create({
  accountsList: {
    paddingVertical: 10,
  },
  headerContainer: {
    height: 106,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    marginTop: 40,
    position: 'relative',
  },
  warning: {
    textAlign: 'center',
    paddingHorizontal: 12,
    marginTop: 12,
  },
  appIcon: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -30,
    left: 'auto',
    right: 'auto',
  },
  container: {
    flex: 1,
    paddingHorizontal: '2.5%',
  },
  title: { textAlign: 'center' },
  titleSpace: { marginVertical: 12 },
  btn: {
    width: '100%',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red',
    marginTop: 'auto',
    marginBottom: 100,
    borderRadius: 13,
  },
});
export default authenticationBottomSheetStyles;
