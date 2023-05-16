import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  itemsContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 1,
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
  scanner: {
    flex: 1,
    backgroundColor: '#777',
    marginTop: -23,
    marginBottom: -23,
  },
  footer: {
    backgroundColor: 'black',
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
    paddingTop: 25,
    zIndex: 1,
  },
});
