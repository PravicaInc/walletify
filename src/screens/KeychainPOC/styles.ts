import { StyleSheet } from 'react-native';

import { PADDING_HORIZONTAL } from '../../shared/layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  keyboardContainer: {
    paddingTop: 50,
    paddingHorizontal: PADDING_HORIZONTAL,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  shield: {
    marginTop: 'auto',
  },
  title: { marginVertical: 10 },
  description: { textAlign: 'center', marginBottom: 40 },
  input: {
    width: '90%',
    marginTop: 8,
    marginBottom: 24,
    flex: undefined,
    height: 60,
  },
  button: {
    marginTop: 20,
  },
  revleation: { marginVertical: 'auto' },
});

export default styles;
