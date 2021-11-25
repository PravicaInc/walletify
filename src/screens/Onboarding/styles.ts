import { StyleSheet } from 'react-native';
import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: PADDING_VERTICAL },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: PADDING_HORIZONTAL,
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
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
  },
});

export default styles;
