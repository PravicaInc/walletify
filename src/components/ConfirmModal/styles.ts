import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  sheet: { marginHorizontal: '2.5%' },
  top: {
    flex: 0.8,
    borderRadius: 13,
    marginBottom: 10,
  },
  imgContainer: {
    flex: 0.38,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: '3%',
  },
  descriptionContainer: {
    flex: 0.38,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: '2%',
    paddingBottom: '1%',
  },
  descriptionTxt: { textAlign: 'center', marginTop: 8 },
  resetContainer: { flex: 0.25 },
  bottom: {
    flex: 0.2,
    borderRadius: 13,
  },
  button: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
