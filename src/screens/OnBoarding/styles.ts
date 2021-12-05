import { StyleSheet } from 'react-native';
import { PADDING_HORIZONTAL } from '../../shared/layout';

export default StyleSheet.create({
  container: { flex: 1 },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 15,
  },
  body: {
    textAlign: 'center',
    width: '80%',
  },
  paginationContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    flex: 0.35,
    justifyContent: 'space-between',
  },
  paginationDots: {
    height: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    height: 60,
  },
});
