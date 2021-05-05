/* eslint-disable react-hooks/exhaustive-deps */
import React, {createRef} from 'react';
import {Image, Text, TouchableOpacity, View, Linking} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {pushNavigation, resetNavigation} from '../../../routes';
import {useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import {doSignOut} from '../../store/wallet';
import {doSetOnboardingPath} from '../../store/onboarding/actions';
import ActionSheet from 'react-native-actions-sheet';

const actionSheetRef = createRef();

const Stacks: React.FC = () => {
  const {dispatch} = useNavigation();
  const wallet = useSelector(selectCurrentWallet);
  const currentDispatch = useDispatch();
  const logout = () => {
    actionSheetRef.current?.setModalVisible(false);
    currentDispatch(doSignOut());
    currentDispatch(doSetOnboardingPath(undefined));
    AsyncStorage.clear();
    resetNavigation(dispatch, 'Login');
  };

  const settings = () => {
    actionSheetRef.current?.setModalVisible(true);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <View>
            <Image source={require('../../assets/fingerprint.png')} />
            <Text style={styles.headerText}>Stacks</Text>
          </View>
          <TouchableOpacity onPress={settings} style={styles.logoutButton}>
            <Image
              style={styles.logoutLogo}
              source={require('../../assets/settings.png')}
            />
          </TouchableOpacity>
        </View>
        <ActionSheet ref={actionSheetRef}>
          <View style={{padding: 16}}>
            <TouchableOpacity
              onPress={() => {
                actionSheetRef.current?.setModalVisible(false);
                pushNavigation(dispatch, {
                  routeName: 'Username',
                  params: {
                    isNewId: true,
                  },
                });
              }}
              style={styles.actionButton}>
              <Image
                style={styles.logoutLogo}
                source={require('../../assets/person.png')}
              />
              <Text style={styles.text}>Add new ID</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                actionSheetRef.current?.setModalVisible(false);
                pushNavigation(dispatch, {routeName: 'EditPinCode'});
              }}
              style={styles.actionButton}>
              <Image
                style={styles.logoutLogo}
                source={require('../../assets/pin-settings.png')}
              />
              <Text style={styles.text}>Edit Pin</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                actionSheetRef.current?.setModalVisible(false);
                Linking.openURL(
                  'https://pravica.atlassian.net/servicedesk/customer/portals',
                );
              }}
              style={styles.actionButton}>
              <Image
                style={styles.logoutLogo}
                source={require('../../assets/support.png')}
              />
              <Text style={styles.text}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={logout}
              style={[styles.actionButton, {borderBottomWidth: 0}]}>
              <Image
                style={styles.logoutLogo}
                source={require('../../assets/logout-grey.png')}
              />
              <Text style={styles.text}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
      </View>
    </>
  );
};

export default Stacks;
