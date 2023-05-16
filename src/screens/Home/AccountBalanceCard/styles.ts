import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    height: 136,
    width: '100%',
    padding: 16,
    borderRadius: 13,
    marginBottom: 15.5,
    position: 'relative',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  currency: {
    fontSize: 22,
  },
  balanceActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    bottom: -24,
    position: 'absolute',
    left: '5%',
    zIndex: 10,
  },
  balanceActionButton: {
    height: 53,
    borderRadius: 13,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    marginRight: 10,
  },
  balanceActionButtonText: {
    marginLeft: 5,
  },
});
