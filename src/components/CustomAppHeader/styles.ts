import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: '2.5%',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
    zIndex: 1,
  },
  fullWidth: { flex: 1 },
  titleWrapper: { flex: 1 },
  normal: { marginRight: 6 },
  title: { width: '100%' },
  create: { flexDirection: 'row', alignSelf: 'flex-end' },
  backWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    height: 44,
    paddingRight: 10,
  },
  arrow: {
    marginRight: 4,
  },
});

export default styles;
