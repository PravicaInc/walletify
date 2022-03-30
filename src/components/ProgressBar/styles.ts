import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 6,
    flexDirection: 'row',
  },
  roundedContainer: { width: 'auto' },
  progressItem: {
    flex: 1,
    borderRadius: 13,
    marginHorizontal: 2,
  },
  roundedProgressItem: {
    width: 6,
    borderRadius: 6,
    marginRight: 3,
  },
});

export default styles;
