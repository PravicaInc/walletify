import {StyleSheet} from 'react-native';
import {theme} from '../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 44,
    paddingTop: 64,
    paddingHorizontal: 28,
  },
  loginButton: {
    padding: 8,
    backgroundColor: theme.colors.badgeBackground,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderRadius: 10,
    width: '100%',
    marginTop: 45,
    height: 48,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: {height: 1, width: 0},
    shadowOpacity: 0.75,
    shadowRadius: 1,
  },
  loginLogo: {width: 24, height: 24, marginRight: 9},
  buttonText: {color: theme.colors.white, fontSize: 14},
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginVertical: 10,
  },
  text: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    marginVertical: 16,
  },
  desc: {
    color: 'black',
    fontSize: 18,
    textAlign: 'left',
    marginVertical: 16,
  },
  cell: {
    width: 55,
    height: 55,
    lineHeight: 55,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginLeft: 8,
    borderRadius: 12,
    borderColor: '#707070',
    borderWidth: 1,
  },
  focusCell: {
    shadowColor: '#3CA5FF',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3,

    elevation: 5,
  },
  errCell: {
    borderColor: '#FE3939',
  },
});
