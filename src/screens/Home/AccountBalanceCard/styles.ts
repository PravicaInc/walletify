import { StyleSheet } from 'react-native';

const AccountBalanceCardStyles = StyleSheet.create({
  container: {
    height: 147,
    width: '100%',
    paddingVertical: '5%',
    paddingHorizontal: 16,
    borderRadius: 24,
    position: 'relative',
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balance: {
    fontSize: 35,
    marginTop: 10,
  },
  currency: {
    fontSize: 22,
  },
  balanceActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    left: '2.5%',
    bottom: -10,
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

export default AccountBalanceCardStyles;
