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
  alignRight: { alignSelf: 'flex-end' },
});
