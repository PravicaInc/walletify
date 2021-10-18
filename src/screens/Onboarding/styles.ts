import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: '2.5%',
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
    paddingHorizontal: '2.5%',
    flex: 0.7,
    justifyContent: 'flex-end',
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
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
