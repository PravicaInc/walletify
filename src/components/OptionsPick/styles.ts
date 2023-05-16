import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    width: '90%',
    marginLeft: '5%',
    borderRadius: 13,
  },
  contentContainer: {
    borderRadius: 13,
    overflow: 'hidden',
  },
  cancelWrapper: {
    marginTop: 10,
    borderRadius: 13,
    overflow: 'hidden',
  },
  cancel: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  separator: {
    height: 0.5,
    width: '100%',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  user: {
    alignItems: 'center',
    marginVertical: 20,
  },
  username: {
    marginTop: 5,
    paddingHorizontal: 20,
  },
  subTitle: {
    marginVertical: 20,
    alignSelf: 'center',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  title: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: -10,
    alignSelf: 'center',
  },
  name: {
    marginHorizontal: 10,
  },
});

export default styles;
