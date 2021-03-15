/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
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

const Home: React.FC = () => {
  const {dispatch} = useNavigation();
  const wallet = useSelector(selectCurrentWallet);
  const currentDispatch = useDispatch();
  const logout = () => {
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

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('url', (e: any) => {
      console.warn(e);
      if (e.url) {
        const queryStr = e.url.split(':');
        if (queryStr.length > 1) {
          const parts = queryStr[1].split('=');
          if (parts.length > 1) {
            currentDispatch(doSaveAuthRequest(parts[1]));
          }
        }
      }
    });
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (authRequest) {
      setModalVisible(true);
    }
  }, [initialUrl, processing, authRequest]);

  return (
    <>
      <ImageBackground
        source={require('../../assets/pravica-background.png')}
        style={styles.container}>
        <View style={styles.topHeader}>
          <Image
            style={styles.pravicaLogo}
            source={require('../../assets/login-header.png')}
          />
          <TouchableOpacity onPress={logout} style={styles.logoutButton}>
            <Text style={styles.buttonText}>Logout</Text>
            <Image
              style={styles.logoutLogo}
              source={require('../../assets/logout.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.sheetContainer}>
          <FlatList
            ListHeaderComponent={
              <Text style={styles.headerText}>Your Stacks IDs</Text>
            }
            style={{padding: 16}}
            data={wallet?.identities}
            renderItem={({item}) => (
              <IdentityCard
                firstBitcoinAddress={wallet?.firstBitcoinAddress || ''}
                identity={item}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <AuthModal
          icon={icon}
          identities={wallet?.identities || []}
          modalVisible={modalVisible}
          name={name}
          setModalVisible={setModalVisible}
        />
      </ImageBackground>
    </>
  );
};

export default Home;
