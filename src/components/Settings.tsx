/* eslint-disable react-native/no-inline-styles */
import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import {useNavigation} from 'react-navigation-hooks';
import {useDispatch} from 'react-redux';
import {pushNavigation, resetNavigation} from '../../routes';
import {
  doSetPinCreated,
  doSetOnboardingPath,
} from '../store/onboarding/actions';
import {doSignOut} from '../store/wallet';

interface Props {
  actionSheetRef: any;
}

export const Settings: React.FC<Props> = (props: Props) => {
  const {dispatch} = useNavigation();
  const currentDispatch = useDispatch();
  const logout = () => {
    props.actionSheetRef.current?.setModalVisible(false);
    currentDispatch(doSetPinCreated(false));
    currentDispatch(doSignOut());
    currentDispatch(doSetOnboardingPath(undefined));
    AsyncStorage.clear();
    resetNavigation(dispatch, 'Login');
  };
  return (
    <>
      <ActionSheet
        onPositionChanged={(e) => console.warn(e)}
        gestureEnabled={true}
        containerStyle={{borderTopLeftRadius: 38, borderTopRightRadius: 38}}
        ref={props.actionSheetRef}>
        <View style={{paddingVertical: 48, paddingHorizontal: 48}}>
          <TouchableOpacity
            onPress={() => {
              props.actionSheetRef.current?.setModalVisible(false);
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
              source={require('../assets/person-action.png')}
            />
            <Text style={styles.text}>Add new ID</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.actionSheetRef.current?.setModalVisible(false);
              pushNavigation(dispatch, {routeName: 'EditPinCode'});
            }}
            style={styles.actionButton}>
            <Image
              style={styles.logoutLogo}
              source={require('../assets/password-action.png')}
            />
            <Text style={styles.text}>Change PIN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.actionSheetRef.current?.setModalVisible(false);
              Linking.openURL(
                'https://pravica.atlassian.net/servicedesk/customer/portals',
              );
            }}
            style={styles.actionButton}>
            <Image
              style={styles.logoutLogo}
              source={require('../assets/help-action.png')}
            />
            <Text style={styles.text}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={logout}
            style={[styles.actionButton, {borderBottomWidth: 0}]}>
            <Image
              style={styles.logoutLogo}
              source={require('../assets/logout-action.png')}
            />
            <Text style={styles.text}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ActionSheet>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  text: {
    color: '#707070',
    fontSize: 20,
    marginLeft: 10,
  },
  actionButton: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderBottomColor: '#D0D2D2',
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  logoutLogo: {width: 24, height: 24, resizeMode: 'contain', marginRight: 22},
});
