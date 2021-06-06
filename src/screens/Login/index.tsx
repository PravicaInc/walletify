/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {pushNavigation, resetNavigation} from '../../../routes';
import {theme} from '../../../theme';
import {ScrollView} from 'react-native-gesture-handler';

const Login: React.FC = () => {
  const {dispatch: navigationDispatch} = useNavigation();

  const onSubmit = () => {
    pushNavigation(navigationDispatch, {
      routeName: 'SeedPhrase',
    });
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.container}
        style={{backgroundColor: 'white'}}>
        <Image
          style={styles.imageLogo}
          source={require('../../assets/logo.png')}
        />
        <Text style={styles.title}>
          Seamless onboarding experience for your decentralized authentication.
        </Text>
        <View
          style={[
            styles.flexRow,
            {paddingBottom: 5, borderBottomWidth: 1, borderTopWidth: 1},
          ]}>
          <Image
            style={styles.pravicaLogo}
            source={require('../../assets/lock-icon.png')}
          />
          <Text style={styles.desc}>
            Create your decentralized identity and store your keys locally and
            securely.
          </Text>
        </View>
        <View
          style={[styles.flexRow, {paddingBottom: 5, borderBottomWidth: 1}]}>
          <Image
            style={styles.pravicaLogo}
            source={require('../../assets/blind-icon.png')}
          />
          <Text style={styles.desc}>
            No dApp from stacks can access your keys, they just ask you to
            permit the authentication process.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            resetNavigation(navigationDispatch, 'CreateWallet');
          }}
          style={[styles.loginButton]}>
          <Text style={styles.buttonText}>Create Your Stacks ID</Text>
          <Image
            style={styles.loginLogo}
            source={require('../../assets/key-icon.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onSubmit}
          style={[styles.loginButton, styles.continueButton]}>
          <Text
            style={[styles.buttonText, {color: theme.colors.badgeBackground}]}>
            Restore Your Stacks ID
          </Text>
          <Image
            style={styles.loginLogo}
            source={require('../../assets/login-purple.png')}
          />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default Login;
