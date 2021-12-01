import { StyleSheet } from 'react-native';

const activityTabStyles = StyleSheet.create({
  activityList: {
    flex: 1,
  },
  activityListContent: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMessage: {
    marginTop: 14,
  },
});
export default activityTabStyles;
