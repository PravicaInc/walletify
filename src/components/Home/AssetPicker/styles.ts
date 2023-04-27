import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  tokenCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 13,
    paddingVertical: 12,
    paddingLeft: 8,
    paddingRight: 12,
    marginBottom: 10,
    marginTop: 40,
  },
  tokenInformationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSpace: {
    marginVertical: 1.5,
  },
  headerContainer: {
    paddingTop: 22,
    paddingHorizontal: 20,
  },
  assetsList: {
    flex: 1,
    marginTop: 15,
    paddingHorizontal: '5%',
  },
  asset: {
    width: '100%',
    height: 75,
    paddingLeft: 8,
    paddingRight: 12,
    marginVertical: 5,
    borderRadius: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
