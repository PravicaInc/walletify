/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
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
  doFinishSignIn,
  doSaveAuthRequest,
  doSetOnboardingPath,
} from '../../store/onboarding/actions';
import {decodeToken} from 'jsontokens';
import {
  selectAppName,
  selectDecodedAuthRequest,
  selectFullAppIcon,
} from '../../store/onboarding/selectors';

const useMount = (func) => useEffect(() => func(), []);

const useInitialURL = () => {
  const [url, setUrl] = useState(null);
  const [processing, setProcessing] = useState(true);
  const currentDispatch = useDispatch();
  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      console.warn('Initial', initialUrl);
      // The setTimeout is just for testing purpose
      setTimeout(() => {
        currentDispatch(doSaveAuthRequest(initialUrl?.split('=')[1]));
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
  const [modalVisible, setModalVisible] = useState(true);
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
  console.warn('ehh', authRequest);
  const renderItem = ({item}) => {
    return (
      <View style={styles.item}>
        <Text style={styles.blockstackIdText}>{item.defaultUsername}</Text>
        <View style={styles.adresses}>
          <Image
            source={require('../../assets/stacks.png')}
            style={styles.icon}
          />
          <Text style={styles.address}>{item.address}</Text>
        </View>
        <View style={styles.adresses}>
          <Image
            source={require('../../assets/bitcoin.png')}
            style={styles.icon}
          />
          <Text style={styles.address}>{wallet?.firstBitcoinAddress}</Text>
        </View>
      </View>
    );
  };

  const renderModalItem = ({item}) => {
    return (
      <Pressable
        onPress={() => currentDispatch(doFinishSignIn({identityIndex: 0}))}
        style={styles.item}>
        <Text style={styles.blockstackIdText}>{item.defaultUsername}</Text>
      </Pressable>
    );
  };

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
            renderItem={renderItem}
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
                renderItem={renderModalItem}
              />
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </>
  );
};

export default Home;
