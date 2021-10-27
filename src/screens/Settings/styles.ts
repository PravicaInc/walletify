import { StyleSheet } from 'react-native';
import { PADDING_HORIZONTAL, PADDING_VERTICAL } from '../../shared/layout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    shadowOpacity: 0,
  },
  contentContainer: {
    paddingHorizontal: '5%',
    paddingVertical: PADDING_VERTICAL,
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topContent: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'grey',
    borderRadius: 26,
    padding: 15,
    flexDirection: 'row',
    marginTop: '8%',
  },
  cardTextContainer: {
    marginLeft: 10,
  },
  settingsItemsContainer: {
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
  },
  settingsItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    alignItems: 'center',
  },
  bioSetting: {
    justifyContent: 'space-between',
  },
  bioSettingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemText: {
    marginLeft: 10,
  },
  bottomContent: {
    width: '100%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bottomText: {
    marginLeft: 5,
  },
  settingsLinkContainer: {
    flexDirection: 'row',
  },
  settingsLinkText: { marginLeft: 5 },
});
