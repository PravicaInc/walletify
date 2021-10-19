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
  word: {
    width: '25%',
    flexDirection: 'row',
    overflow: 'hidden',
    paddingRight: 5,
    paddingVertical: 15,
  },
});

export default styles;
