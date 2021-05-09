/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  NativeEventEmitter,
  NativeModules,
  Linking,
} from 'react-native';
import {styles} from './styles';
import {useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {useDispatch} from 'react-redux';
import {doSaveAuthRequest} from '../../store/onboarding/actions';
import {
  selectAppName,
  selectDecodedAuthRequest,
  selectFullAppIcon,
} from '../../store/onboarding/selectors';
import {IdentityCard} from '../../components/IdentityCard';
import {useInitialURL} from '../../hooks/useInitialURL';
import AuthModal from '../AuthModal';
import {HeaderComponent} from '../../components/Header';

const {EventEmitterModule} = NativeModules;

const Home: React.FC = () => {
  const wallet = useSelector(selectCurrentWallet);
  const currentDispatch = useDispatch();
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
      console.warn('linking', event);
      if (event.sourceApplication) {
        setSourceApplication(event.sourceApplication);
      }
    });
    const subscription = Linking.addListener('url', (e: any) => {
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

  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Identities'}
          imageSource={require('../../assets/fingerprint.png')}
        />
        <FlatList
          data={wallet?.identities}
          renderItem={({item}) => <IdentityCard identity={item} />}
          keyExtractor={(item, index) => index.toString()}
        />
        <AuthModal
          icon={icon}
          identities={wallet?.identities || []}
          modalVisible={modalVisible}
          name={name}
          setModalVisible={setModalVisible}
        />
      </View>
    </>
  );
};

export default Home;
