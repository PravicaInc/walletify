import {useState, useEffect} from 'react';
import {
  Linking,
  NativeEventEmitter,
  NativeModules,
  Platform,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentWallet} from '../store/wallet/selectors';
import {doSaveAuthRequest} from '../store/onboarding/actions';

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

export const useAuthenticatorListeners = () => {
  const wallet = useSelector(selectCurrentWallet);
  const currentDispatch = useDispatch();
  const [sourceApplication, setSourceApplication] = useState('');
  const [url, setUrl] = useState('');
  const eventEmitter = new NativeEventEmitter(EventEmitterModule);

  useEffect(() => {
    if (wallet) {
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
    }
  }, [wallet, eventEmitter]);
  useEffect(() => {
    if (Platform.OS === 'ios' && wallet) {
      const subscription = Linking.addListener('url', (e: any) => {
        if (e.url) {
          const token = getParameterByName('token', e.url);
          setUrl(token || '');
        }
      });
      return () => subscription.remove();
    }
  }, [wallet]);

  useEffect(() => {
    if (url.length > 0 && sourceApplication.length > 0 && wallet) {
      currentDispatch(doSaveAuthRequest(url, sourceApplication));
      setUrl('');
      setSourceApplication('');
    }
  }, [url, sourceApplication, wallet]);
};
