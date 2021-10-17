import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  allSlidesContainer: {flex: 1},
  slideContainer: {flex: 1},
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 96, // Add padding to offset large buttons and pagination in bottom of page
  },
  image: {
    width: '75%',
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
  activeDotStyle: {backgroundColor: '#000000'},
  dotStyle: {backgroundColor: '#CDCBD8'},
  bottomButton: {},
});

export default styles;
