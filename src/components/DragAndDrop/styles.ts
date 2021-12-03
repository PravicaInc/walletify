import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  draxWrapper: { flex: 1, width: '100%' },
  container: { flex: 1, width: '100%', justifyContent: 'space-between' },
  pillsContainer: {
    flexDirection: 'row',
    width: '100%',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pillWrapper: {
    height: 37,
    width: '48%',
    marginBottom: 28,
  },
  pill: {
    borderRadius: 13,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  dragging: { position: 'relative', top: '-100%' },
});

export default styles;
