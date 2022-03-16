import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: '2.5%',
  },
  inputsContainer: {
    flex: 1,
    paddingHorizontal: '2.5%',
    paddingTop: 40,
  },
  alignRight: { alignSelf: 'flex-end' },
  noteWrapper: {
    flexDirection: 'row',
    padding: 12,
    borderTopRightRadius: 13,
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13,
    marginTop: 20,
  },
  note: {
    marginLeft: 5,
  },
  noBalanceRow: {
    marginHorizontal: 5,
    flex: 1,
  },
  noBalanceCard: {
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 13,
    flexDirection: 'row',
    padding: 10,
  },
});
