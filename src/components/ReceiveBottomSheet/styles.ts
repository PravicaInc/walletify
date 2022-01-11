import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '2.5%',
  },
  fill: { flex: 1, width: '100%' },
  horizontalFill: { width: '100%' },
  alignCenter: { alignSelf: 'center' },
  alignRight: { alignSelf: 'flex-end' },
  centerItems: { alignItems: 'center' },
  warningText: {
    textAlign: 'center',
    paddingHorizontal: '5%',
  },
  warningContainer: {
    marginTop: '10%',
  },
  qrCodeContainer: {
    marginVertical: '20%',
    alignSelf: 'center',
  },
  accountInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  copyAddressButton: {
    marginLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyAddressIcon: {
    marginLeft: 5,
  },
});
