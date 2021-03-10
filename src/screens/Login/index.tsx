/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {doSetMagicRecoveryCode} from '../../store/onboarding/actions';
import {doStoreSeed} from '../../store/wallet';
import {DEFAULT_PASSWORD} from '../../store/onboarding/types';

const Login: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [seed, setSeed] = useState('');
  const [seedError, setSeedError] = useState<null | string>(null);
  const currentDispatch = useDispatch();
  const {dispatch} = useNavigation();

  const wallet = useSelector(selectCurrentWallet);
  useEffect(() => {
    if (wallet) {
      resetNavigation(dispatch, 'Home');
    }
  }, [wallet]);

  const onSubmit = async () => {
    setLoading(true);
    console.warn('Clicked');
    const parsedKeyInput = seed.trim();
    try {
      if (parsedKeyInput.length === 0) {
        setSeedError('Entering your Secret Key is required.');
        setLoading(false);
        return;
      }
      if (parsedKeyInput.split(' ').length <= 1) {
        currentDispatch(doSetMagicRecoveryCode(parsedKeyInput));
        return;
      }
      const currentWallet = await doStoreSeed(parsedKeyInput, DEFAULT_PASSWORD)(
        currentDispatch,
        () => ({}),
        {},
      );
      console.warn(currentWallet);
      if (currentWallet) {
        resetNavigation(dispatch, 'Home');
      }
    } catch (error) {
      setSeedError("The Secret Key you've entered is invalid");
      console.warn(error);
    }
    setLoading(false);
  };
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>Login with your Blockstack ID</Text>
        {isLoading ? (
          <Text>Loading</Text>
        ) : (
          <TouchableOpacity
            disabled={isLoading}
            onPress={onSubmit}
            style={styles.loginButton}>
            <>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={'white'} />
              ) : (
                <Text style={styles.buttonText}>Blockstack ID</Text>
              )}
            </>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default Login;
