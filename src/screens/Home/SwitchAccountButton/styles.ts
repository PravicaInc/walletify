import { StyleSheet } from 'react-native';

const switchAccountButtonStyles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingEnd: 23,
    paddingStart: 7,
    marginBottom: 10,
    borderRadius: 13,
  },
  switchIconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
});
export default switchAccountButtonStyles;
