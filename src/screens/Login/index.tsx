/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import {doCreateSecretKey} from '../../store/onboarding/actions';
import {useDispatch} from 'react-redux';
import PBKDF2 from '@react-native-cryptocurrencies/react-native-pbkdf2';

require('crypto').pbkdf2.drive = (password, salt, iterations) =>
  PBKDF2.derivationKey(password, salt, iterations);
const Login: React.FC = () => {
  const {dispatch: navigationDispatch} = useNavigation();
  const dispatch = useDispatch();

  const onSubmit = () => {
    resetNavigation(navigationDispatch, 'SeedPhrase');
  };

  return (
    <>
      <View style={styles.container}>
        {/* <Image
          style={styles.pravicaLogo}
          source={require('../../assets/login-header.png')}
        /> */}
        <View style={styles.card}>
          <View style={styles.flexRow}>
            <Image
              style={styles.pravicaLogo}
              source={require('../../assets/authlogo.png')}
            />
            <View>
              <Text style={styles.title}>Pravica guarantees your privacy</Text>
              <Text style={styles.description}>
                <Text style={styles.description}>
                by encrypting everything
            </Text>
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              dispatch(doCreateSecretKey());
              resetNavigation(navigationDispatch, 'CreateWallet');
            }}
            style={[styles.loginButton, styles.continueButton]}>
            <Text style={styles.buttonText}>Create new wallet</Text>
            <Image
              style={styles.loginLogo}
              source={require('../../assets/login.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onSubmit} style={styles.loginButton}>
            <Text style={styles.buttonText}>Continue with your Secret key</Text>
            <Image
              style={styles.loginLogo}
              source={require('../../assets/login.png')}
            />
          </TouchableOpacity>
        </View>
        <Text style={{color: 'white', marginTop: 'auto', marginBottom: 10}}>
          Powered by Pravica
        </Text>
      </View>
    </>
  );
};

export default Login;
