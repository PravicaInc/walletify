import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 0.4,
  },
  header: {
    shadowOpacity: 0,
    height: 20,
  },
  topContent: {
    alignItems: 'center',
    width: '90%',
    flex: 0.7,
    justifyContent: 'center',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center', width: '80%' },
  seedTitle: { marginBottom: 10 },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    height: 60,
  },
  pusher: {
    justifyContent: 'flex-start',
    paddingHorizontal: PADDING_HORIZONTAL,
    flex: 0.6,
    marginTop: '30%',
    width: '100%',
  },
});

export default styles;
