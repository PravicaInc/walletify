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
  tokenCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 13,
    paddingVertical: 12,
    paddingLeft: 8,
    paddingRight: 12,
    marginVertical: 10,
  },
  tokenInformationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 13,
  },
});
