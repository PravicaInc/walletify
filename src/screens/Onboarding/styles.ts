import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  allSlidesContainer: { flex: 1 },
  slideContainer: { flex: 1 },
  slide: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  imageContainer: { flex: 1, justifyContent: 'flex-end' },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 30,
  },
  activeDotStyle: { backgroundColor: '#000000' },
  dotStyle: { backgroundColor: '#CDCBD8' },
  bottomButton: { marginTop: 100, marginBottom: 20 },
});

export default styles;
