/* eslint-disable react-hooks/exhaustive-deps */
import React, {createRef, useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  NativeEventEmitter,
  NativeModules,
  Linking,
} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {pushNavigation, resetNavigation} from '../../../routes';
import {useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import AsyncStorage from '@react-native-community/async-storage';
import {useDispatch} from 'react-redux';
import {doSignOut} from '../../store/wallet';
import {
  doSaveAuthRequest,
  doSetOnboardingPath,
} from '../../store/onboarding/actions';
import {
  selectAppName,
  selectDecodedAuthRequest,
  selectFullAppIcon,
} from '../../store/onboarding/selectors';
import {IdentityCard} from '../../components/IdentityCard';
import {useInitialURL} from '../../hooks/useInitialURL';
import AuthModal from '../AuthModal';
import ActionSheet from 'react-native-actions-sheet';

const actionSheetRef = createRef();

const {EventEmitterModule} = NativeModules;

const Home: React.FC = () => {
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
  const authRequest = useSelector(selectDecodedAuthRequest);
  const name = useSelector(selectAppName);
  const icon = useSelector(selectFullAppIcon);
  const [modalVisible, setModalVisible] = useState(false);
  const {url: initialUrl, processing} = useInitialURL();
  const [sourceApplication, setSourceApplication] = useState('');
  const [url, setUrl] = useState('');
  const eventEmitter = new NativeEventEmitter(EventEmitterModule);

  useEffect(() => {
    eventEmitter.addListener('Linking', (event) => {
      if (event.sourceApplication) {
        setSourceApplication(event.sourceApplication);
      }
    });
    const subscription = DeviceEventEmitter.addListener('url', (e: any) => {
      if (e.url) {
        const queryStr = e.url.split(':');
        if (queryStr.length > 1) {
          const parts = queryStr[1].split('=');
          if (parts.length > 1) {
            setUrl(parts[1]);
          }
        }
      }
    });
    if (url && sourceApplication) {
      currentDispatch(doSaveAuthRequest(url, sourceApplication));
      setUrl('');
      setSourceApplication('');
    }
    return () => subscription.remove();
  }, [sourceApplication, url]);

  useEffect(() => {
    if (authRequest) {
      setModalVisible(true);
    }
  }, [initialUrl, processing, authRequest]);

  const settings = () => {
    actionSheetRef.current?.setModalVisible(true);
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.topHeader}>
          <View>
            <Image source={require('../../assets/fingerprint.png')} />
            <Text style={styles.headerText}>Identity</Text>
          </View>
          <TouchableOpacity onPress={settings} style={styles.logoutButton}>
            <Image
              style={styles.logoutLogo}
              source={require('../../assets/settings.png')}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={wallet?.identities}
          renderItem={({item}) => (
            <IdentityCard
              firstBitcoinAddress={wallet?.firstBitcoinAddress || ''}
              identity={item}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <AuthModal
          icon={icon}
          identities={wallet?.identities || []}
          modalVisible={modalVisible}
          name={name}
          setModalVisible={setModalVisible}
        />
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

export default Home;
