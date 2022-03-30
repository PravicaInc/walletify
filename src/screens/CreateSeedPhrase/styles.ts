import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    alignItems: 'center',
    flex: 1,
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  smallSpace: {
    marginHorizontal: 2,
  },
  progress: {
    marginTop: '5%',
    marginHorizontal: PADDING_HORIZONTAL,
    width: '95%',
  },
  back: {
    marginLeft: PADDING_HORIZONTAL,
  },
  topContent: {
    alignItems: 'center',
    width: '90%',
    flex: 0.7,
    justifyContent: 'center',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center', marginBottom: 50 },
  confirmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    height: 60,
    marginBottom: 10,
  },
  reveal: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    top: '25%',
    bottom: '25%',
    width: '100%',
    alignItems: 'center',
  },
});

export default styles;
