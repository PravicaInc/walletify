import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  transactionsHeader: {
    marginVertical: 10,
  },
  list: {
    paddingTop: 10,
  },
  header: {
    shadowOpacity: 0,
    paddingHorizontal: 0,
    paddingRight: 5,
    width:'100%',
  },
  contentContainer: {
    paddingTop: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  roundedBottomCorners: {
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  balanceContainer: {
    padding: 20,
    position: 'relative',
  },
  balanceText: {
    marginTop: 8,
  },
  balanceValueTitle: {
    marginTop: 24,
  },
  stxIcon: {
    zIndex: -1,
    position: 'absolute',
    right: '10%',
    bottom: 40,
  },
  tokenImage: {
    zIndex: 1,
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  balanceActionButtonText: {
    marginLeft: 5,
  },
  sendButton: {
    marginRight: 10,
  },
  balanceActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    bottom: -24,
    position: 'absolute',
    left: '10%',
    zIndex: 10,
  },
  balanceActionButton: {
    height: 53,
    borderRadius: 13,
    flex: 0.45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 10,
  },
  transactionsContainer: {
    flex: 1,
    marginTop: 46,
    paddingHorizontal: 20,
  },
});
