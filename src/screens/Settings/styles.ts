import { StyleSheet } from 'react-native';
import { PADDING_VERTICAL } from '../../shared/layout';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingLeft: 0,
  },
  contentContainer: {
    paddingHorizontal: '2.5%',
    paddingBottom: PADDING_VERTICAL,
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
    marginTop: 26,
    borderBottomWidth: 0.5,
    paddingBottom: 15,
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
