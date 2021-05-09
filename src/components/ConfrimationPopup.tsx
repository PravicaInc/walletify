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

export const ConfirmationPopup: React.FC<Props> = (props: Props) => {
  return (
    <>
      <ActionSheet
        onPositionChanged={(e) => console.warn(e)}
        gestureEnabled={true}
        containerStyle={{borderTopLeftRadius: 38, borderTopRightRadius: 38}}
        ref={props.actionSheetRef}>
        <View style={{paddingVertical: 48, paddingHorizontal: 48}} />
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
  logoutLogo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginRight: 22,
  },
});
