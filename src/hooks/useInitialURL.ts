import {useDispatch} from 'react-redux';
import {useState, useEffect} from 'react';
import {Linking} from 'react-native';
import {doSaveAuthRequest} from '../store/onboarding/actions';
const useMount = (func: any) => useEffect(() => func(), []);

export const useInitialURL = () => {
  const [url, setUrl] = useState('');
  const [processing, setProcessing] = useState(true);
  const dispatch = useDispatch();
  useMount(() => {
    const getUrlAsync = async () => {
      // Get the deep link used to open the app
      const initialUrl = await Linking.getInitialURL();
      // The setTimeout is just for testing purpose
      setTimeout(() => {
        if (initialUrl) {
          dispatch(doSaveAuthRequest(initialUrl?.split('=')[1]));
          setUrl(initialUrl?.split('=')[1]);
        }
        setProcessing(false);
      }, 1000);
    };

    getUrlAsync();
  });
  return {url, processing};
};
