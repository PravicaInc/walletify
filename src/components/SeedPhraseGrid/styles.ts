import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  wordInput: {
    flex: 1,
    height: '100%',
    fontSize: 12,
  },
  word: {
    width: '25%',
    height: 46,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  innerWord: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: 24,
  },
  bottomBorder: {
    borderBottomWidth: 0.5,
  },
  rightBorder: {
    borderRightWidth: 0.5,
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default styles;
