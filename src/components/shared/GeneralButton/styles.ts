import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  wrapper: { width: '100%', height: 60 },
  container: {
    flex: 1,
    justifyContent: 'center',
    borderRadius: 13,
  },
  containerActiveSecondary: {
    borderWidth: 1,
  },
  containerInactiveSecondary: {
    borderWidth: 1,
  },
  txt: { textAlign: 'center' },
});

export default styles;
