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

const Login: React.FC = () => {
  const {dispatch: navigationDispatch} = useNavigation();
  const dispatch = useDispatch();

  const onSubmit = () => {
    resetNavigation(navigationDispatch, 'SeedPhrase');
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
          <Text style={styles.description}>
            Pravica Authonticator will help you to keep your login seamless and
            secure.
          </Text>
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
      </ImageBackground>
    </>
  );
};

export default Login;
