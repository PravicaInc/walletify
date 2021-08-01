import {StyleSheet} from 'react-native';
import {isWideScreen} from '../../utils';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 44,
    paddingTop: isWideScreen ? 64 : 20,
    paddingHorizontal: 28,
    backgroundColor: 'white',
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    textAlign: 'center',
  },
  image: {width: '100%', height: isWideScreen ? 300 : 180},
  view: {justifyContent: 'center', alignItems: 'center'},
  textAlign: {textAlign: 'center'},
});
