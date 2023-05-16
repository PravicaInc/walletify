import { StyleSheet } from 'react-native';

const authenticationBottomSheetStyles = StyleSheet.create({
  accountsList: {
    paddingVertical: 10,
  },
  bottomSheet: {
    borderRadius: 13,
    overflow: 'hidden',
    flex: 1,
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 13,
    marginTop: 40,
    position: 'relative',
    paddingTop: 40,
    paddingBottom: 10,
  },
  warning: {
    textAlign: 'center',
    paddingHorizontal: 12,
  },
  required: {
    paddingHorizontal: 12,
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 13,
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
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  title: { textAlign: 'center' },
  titleSpace: { marginVertical: 12 },
  confirmButton: {
    marginBottom: 50,
  },
});
export default authenticationBottomSheetStyles;
