/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
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
  doDeleteAuthRequest,
  doSaveAuthRequest,
  doSetOnboardingPath,
} from '../../store/onboarding/actions';
import {
  selectAppName,
  selectDecodedAuthRequest,
  selectFullAppIcon,
} from '../../store/onboarding/selectors';
import {IdentityCard} from '../../components/IdentityCard';
import {UsernameCard} from '../../components/UsernameCard';

const useMount = (func) => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState('');
  const [processing, setProcessing] = useState(true);
  const currentDispatch = useDispatch();
  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      // The setTimeout is just for testing purpose
      setTimeout(() => {
        if (initialUrl) {
          currentDispatch(doSaveAuthRequest(initialUrl?.split('=')[1]));
          setUrl(initialUrl?.split('=')[1]);
        }
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  });
  return {url, processing};
};

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
    // console.warn(authRequest);
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Image
                source={{uri: icon}}
                style={{width: 72, height: 72, marginBottom: 16}}
              />
              <Text style={styles.blockstackText}>
                Choose an account to use in {name}
              </Text>
              <FlatList
                ListHeaderComponent={
                  <Text style={styles.headerText}>Your Stacks IDs</Text>
                }
                style={{padding: 16}}
                data={wallet?.identities}
                renderItem={({index, item}) => (
                  <UsernameCard identity={item} identityIndex={index} />
                )}
                keyExtractor={(item, index) => index.toString()}
              />
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  currentDispatch(doDeleteAuthRequest());
                  setModalVisible(!modalVisible);
                }}>
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </>
  );
};

export default Home;
