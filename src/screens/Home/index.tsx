/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  NativeEventEmitter,
  NativeModules,
  Linking,
  Platform,
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
import AuthModal from '../AuthModal';
import {HeaderComponent} from '../../components/Header';

const {EventEmitterModule} = NativeModules;
const getParameterByName = (name: string, url: string) => {
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
const Home: React.FC = () => {
  const wallet = useSelector(selectCurrentWallet);
  const currentDispatch = useDispatch();
  const authRequest = useSelector(selectDecodedAuthRequest);
  const name = useSelector(selectAppName);
  const icon = useSelector(selectFullAppIcon);
  const [modalVisible, setModalVisible] = useState(false);
  const [sourceApplication, setSourceApplication] = useState('');
  const [url, setUrl] = useState('');
  const eventEmitter = new NativeEventEmitter(EventEmitterModule);

  useEffect(() => {
    const subscription = eventEmitter.addListener('Linking', (event) => {
      if (event?.sourceApplication) {
        setSourceApplication(event.sourceApplication);
        if (Platform.OS === 'android') {
          Linking.getInitialURL().then((initialUrl) => {
            const token = getParameterByName('token', initialUrl || '');
            setUrl(token || '');
          });
        }
      }
    });
    return () => subscription.remove();
  }, []);
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const subscription = Linking.addListener('url', (e: any) => {
        if (e.url) {
          const token = getParameterByName('token', e.url);
          setUrl(token || '');
        }
      });
      return () => subscription.remove();
    }
  }, []);

  useEffect(() => {
    if (url.length > 0 && sourceApplication.length > 0) {
      currentDispatch(doSaveAuthRequest(url, sourceApplication));
      setUrl('');
      setSourceApplication('');
    }
  }, [url, sourceApplication]);
  useEffect(() => {
    if (authRequest) {
      setModalVisible(true);
    }
  }, [authRequest]);
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
