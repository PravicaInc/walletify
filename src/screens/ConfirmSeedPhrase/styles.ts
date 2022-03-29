import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: PADDING_HORIZONTAL,
  },
  hiddenItems: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progress: {
    marginTop: '5%',
    marginHorizontal: PADDING_HORIZONTAL,
    width: '95%',
  },
  back: {
    marginLeft: PADDING_HORIZONTAL,
  },
  contentContainer: {
    paddingHorizontal: PADDING_HORIZONTAL,
    alignItems: 'center',
    paddingTop: 35,
    flex: 1,
  },
  title: { marginVertical: 10, alignSelf: 'center' },
  description: { textAlign: 'center', width: '80%', alignSelf: 'center' },
  seedTitle: { marginBottom: 10 },
  pusher: {
    marginTop: 'auto',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 13,
    height: 60,
    marginBottom: 10,
  },
});
