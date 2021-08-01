/* eslint-disable react-hooks/exhaustive-deps */
import {useState, useEffect} from 'react';
import {Linking} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentWallet} from '../store/wallet/selectors';
import {doSaveAuthRequest} from '../store/onboarding/actions';

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
  const [authRequest, setAuthRequest] = useState('');
  useEffect(() => {
    if (wallet) {
      const subscription = Linking.addListener('url', ({url}) => {
        Linking.canOpenURL(url).then((supported) => {
          if (supported) {
            const token = getParameterByName('token', url);
            setAuthRequest(token || '');
          }
        });
      });
      return () => subscription.remove();
    }
  }, [wallet]);

  useEffect(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      Linking.canOpenURL(initialUrl || '').then((supported) => {
        if (supported) {
          const token = getParameterByName('token', initialUrl || '');
          setAuthRequest(token || '');
        }
      });
    };

    if (wallet) {
      getUrlAsync();
    }
  }, [wallet]);

  useEffect(() => {
    if (authRequest.length > 0 && wallet) {
      currentDispatch(doSaveAuthRequest(authRequest));
      setAuthRequest('');
    }
  }, [authRequest, wallet]);
};
