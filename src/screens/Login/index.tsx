/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
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
                <Text style={styles.description}>by encrypting everything</Text>
              </Text>
            </View>
          </View>
          <View
            style={[styles.flexRow, {paddingBottom: 0, borderBottomWidth: 0}]}>
            <Image
              style={styles.pravicaLogo}
              source={require('../../assets/lock-icon.png')}
            />
            <View>
              <Text style={styles.desc}>
                You'll get a Secret Key that automatically encrypts everything
                you do
              </Text>
            </View>
          </View>
          <View
            style={[styles.flexRow, {paddingBottom: 0, borderBottomWidth: 0}]}>
            <Image
              style={styles.pravicaLogo}
              source={require('../../assets/blind-icon.png')}
            />
            <View>
              <Text style={styles.desc}>
                Pravica won’t be able to see, access, or track your activity
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            resetNavigation(navigationDispatch, 'CreateWallet');
          }}
          style={[styles.loginButton]}>
          <Text style={styles.buttonText}>Get your secret key</Text>
          <Image
            style={styles.loginLogo}
            source={require('../../assets/key-icon.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSubmit}
          style={[styles.loginButton, styles.continueButton]}>
          <Text style={[styles.buttonText, {color: '#707070'}]}>
            Continue with your Secret key
          </Text>
          <Image
            style={styles.loginLogo}
            source={require('../../assets/Icon-login-grey.png')}
          />
        </TouchableOpacity>
        <Text style={{color: 'black', marginTop: 'auto', marginBottom: 10}}>
          Powered by Pravica
        </Text>
      </View>
    </>
  );
};

export default Login;
