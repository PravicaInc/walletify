import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  wrapper: {flex: 1, overflow: 'hidden', borderRadius: 13, height: 60},
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerActivePrimary: {backgroundColor: '#000000'},
  containerInactivePrimary: {backgroundColor: '#E0E0E0'},
  containerActiveSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#000000',
  },
  containerInactiveSecondary: {
    backgroundColor: '#ffffff',
    borderColor: '#C1BFBF',
    borderWidth: 1,
  },
  txtActivePrimary: {color: '#ffffff'},
  txtInactivePrimary: {color: '#C1BFBF'},
  txtActiveSecondary: {color: '#000000'},
  txtInactiveSecondary: {color: '#C1BFBF'},
});

export default styles;
