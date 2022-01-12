import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  accountsList: {
    paddingVertical: 10,
  },
  noBalanceCard: {
    marginTop: 10,
    paddingVertical: 20,
    alignItems: 'center',
    borderRadius: 13,
  },
  noBalanceTitle: {
    marginVertical: 5,
  },
  noBalanceDesc: {
    textAlign: 'center',
    width: '85%',
  },
  header: {
    paddingHorizontal: 0,
    marginBottom: 30,
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
  appIconWrapper: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -30,
    left: 'auto',
    right: 'auto',
    zIndex: 12,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  container: {
    flex: 1,
    paddingHorizontal: '2.5%',
    paddingTop: 5,
  },
  title: { textAlign: 'center' },
  titleSpace: { marginVertical: 12 },
  previewPanel: {
    marginVertical: 10,
  },
  horizontalFill: { width: '100%' },
  alignRight: { alignSelf: 'flex-end' },
  centerItems: { alignItems: 'center', marginTop: 'auto' },
  warningText: {
    textAlign: 'center',
    marginTop: 5,
    width: '90%',
  },
});
