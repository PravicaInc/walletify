import {isWideScreen} from './../../utils';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 44,
    paddingTop: isWideScreen ? 64 : 20,
    paddingHorizontal: 28,
    backgroundColor: 'white',
  },
});
