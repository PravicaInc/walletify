import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    borderRadius: 13,
    overflow: 'hidden',
    flex: 1,
    paddingHorizontal: '2.5%',
  },
  header: {
    paddingVertical: 20,
  },
  contentContainer: {
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    flex: 1,
    textAlign: 'justify',
  },
  chips: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  chip: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 86,
    height: 40,
    borderRadius: 13,
    borderWidth: 1,
    marginRight: 10,
  },
});
