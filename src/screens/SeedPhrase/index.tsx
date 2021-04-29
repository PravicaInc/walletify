/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {popNavigation, resetNavigation} from '../../../routes';
import {useDispatch, useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {
  doSaveSecretKey,
  doSetMagicRecoveryCode,
} from '../../store/onboarding/actions';
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
      resetNavigation(dispatch, 'CreatePin');
    }
  }, [wallet]);

  const onSubmit = async () => {
    setLoading(true);
    setSeedError('');
    const parsedKeyInput = seed.trim();
    try {
      if (parsedKeyInput.length === 0) {
        setSeedError('Entering your Secret Key is required.');
        setLoading(false);
        return;
      }
      const currentWallet = await doStoreSeed(parsedKeyInput, DEFAULT_PASSWORD)(
        currentDispatch,
        () => ({}),
        {},
      );
      currentDispatch(doSaveSecretKey(parsedKeyInput));
      if (currentWallet) {
        resetNavigation(dispatch, 'CreatePin');
      }
    } catch (error) {
      setSeedError("The Secret Key you've entered is invalid");
      console.warn(error);
    }
    setLoading(false);
  };

  const goBack = () => popNavigation(dispatch);

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ImageBackground
          source={require('../../assets/pravica-background.png')}
          style={styles.container}>
          <Image
            style={styles.pravicaLogo}
            source={require('../../assets/login-header.png')}
          />
          <KeyboardAvoidingView behavior={'position'}>
            <View style={styles.card}>
              <TouchableOpacity
                onPress={goBack}
                style={[styles.cardItem, {marginBottom: 30}]}>
                <Image
                  style={{width: 25, height: 15, marginRight: 16}}
                  resizeMode="contain"
                  source={require('../../assets/back_arrow.png')}
                />
              </TouchableOpacity>
              <Text style={styles.description}>Enter your Seed Phrase</Text>
              <TextInput
                placeholder={'Type or paste your seed phrase here'}
                placeholderTextColor={'#94A5A6'}
                style={styles.textInput}
                textAlignVertical={'top'}
                multiline={true}
                onChangeText={(text) => setSeed(text)}
              />
              <Text style={styles.seetTextRed}>{seedError}</Text>
              <TouchableOpacity
                disabled={isLoading}
                onPress={onSubmit}
                style={styles.loginButton}>
                <>
                  <Text style={styles.buttonText}>Restore</Text>
                  {isLoading ? (
                    <ActivityIndicator size={'small'} color={'white'} />
                  ) : (
                    <Image
                      style={styles.loginLogo}
                      source={require('../../assets/restore.png')}
                    />
                  )}
                </>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ImageBackground>
      </TouchableWithoutFeedback>
    </>
  );
};

export default SeedPhrase;
