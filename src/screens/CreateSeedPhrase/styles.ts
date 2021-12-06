import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  header: {
    shadowOpacity: 0,
    height: 20,
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
  description: { textAlign: 'center' },
  seedTitle: { marginBottom: 10, marginTop: 'auto' },
  confirmContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pusher: {
    marginTop: 'auto',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    height: 60,
  },
});

export default styles;
