import {Platform, StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 44,
    paddingTop: Platform.OS === 'ios' ? 64 : 32,
    paddingHorizontal: 28,
    backgroundColor: 'white',
  },
});
