import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  puzzleItemWrapper: {
    width: '48%',
    height: 37,
    marginVertical: 14,
  },
  puzzleItem: {
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    width: '100%',
    height: '100%',
  },
  receivingZone: {
    marginVertical: 20,
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hidden: {
    opacity: 0,
  },
});

export default styles;
