import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '2.5%',
  },
  inputsContainer: {
    width: '100%',
    marginTop: '10%',
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: '10%',
  },
  fill: { flex: 1, width: '100%' },
  scrollableContent: {
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
  },
  horizontalFill: { width: '100%' },
  alignRight: { alignSelf: 'flex-end' },
  centerItems: { alignItems: 'center' },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 13,
  },
  previewCard: {
    borderRadius: 24,
    width: '100%',
    paddingHorizontal: 21,
    paddingVertical: 14,
  },
  warningText: {
    textAlign: 'center',
    padding: 10,
    marginBottom: 20,
  },
  transactionDetails: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
  },
  transactionMetadataItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 21,
  },
});
