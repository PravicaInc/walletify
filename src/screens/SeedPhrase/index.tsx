/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {doSetMagicRecoveryCode} from '../../store/onboarding/actions';
import {doStoreSeed} from '../../store/wallet';
import {DEFAULT_PASSWORD} from '../../store/onboarding/types';
import {TextInput} from 'react-native-gesture-handler';

const SeedPhrase: React.FC = () => {
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
      <ImageBackground
        source={require('../../assets/pravica-background.png')}
        style={styles.container}>
        <Image
          style={styles.pravicaLogo}
          source={require('../../assets/login-header.png')}
        />
        <View style={styles.card}>
          <Text style={styles.description}>Enter your Send Phrase</Text>
          <TextInput
            placeholder={'Type or paste your seed phrase here'}
            placeholderTextColor={'#94A5A6'}
            style={styles.textInput}
            textAlignVertical={'top'}
            multiline={true}
            onChangeText={(text) => setSeed(text)}
          />
          <TouchableOpacity
            disabled={isLoading}
            onPress={onSubmit}
            style={styles.loginButton}>
            <>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={'white'} />
              ) : (
                <>
                  <Text style={styles.buttonText}>Restore</Text>
                  <Image
                    style={styles.loginLogo}
                    source={require('../../assets/restore.png')}
                  />
                </>
              )}
            </>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </>
  );
};

export default SeedPhrase;
