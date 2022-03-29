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
    marginTop: 25,
    marginBottom: 20,
    paddingRight: 5,
  },
  contentContainer: {
    paddingTop: 40,
    paddingHorizontal: '2.5%',
    height: 320,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  roundedBottomCorners: {
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  balanceContainer: {
    padding: 20,
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
    bottom: 10,
  },
  balanceActionButton: {
    height: 53,
    borderRadius: 13,
    flex: 0.4,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  transactionsContainer: {
    flex: 1,
    marginTop: 46,
    paddingHorizontal: 20,
  },
});
