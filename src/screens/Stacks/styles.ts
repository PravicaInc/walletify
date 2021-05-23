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
});
