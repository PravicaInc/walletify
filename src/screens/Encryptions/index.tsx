/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {HeaderComponent} from '../../components/Header';
import {pushNavigation} from '../../../routes';
import {useNavigation} from 'react-navigation-hooks';

const Encryptions: React.FC = () => {
  const {dispatch} = useNavigation();

  return (
    <>
      <View style={styles.container}>
        <HeaderComponent
          title={'Encryption'}
          imageSource={require('../../assets/encryption.png')}
        />
        <Text style={{marginBottom: 10, marginTop: 10}}>
          The decentralized identity creation and restoring functions are all
          based on public/private key pairs.
        </Text>
        <Text style={{marginBottom: 10}}>
          Each stacks identity has a distinct key pair for each application you
          visit using a combination of your identity keys on Stacks BNS names.
        </Text>
        <Text style={{marginBottom: 10}}>
          As you are here now, it means that you already created a Stacks ID and
          we assume that you already have saved your seed phrase in a safe
          place, your seed phrase consists of 24 words and it's your only way to
          restore your identity on any device.
        </Text>
        <Text style={{marginBottom: 10}}>
          Backup your ID is a feature from WISE that allowing you to generate
          your seed phrase again just in case you need it.
        </Text>

        <TouchableOpacity
          onPress={() => {
            pushNavigation(dispatch, {
              routeName: 'BackupIdentity',
            });
          }}
          style={styles.loginButton}>
          <Text style={styles.buttonText}>Backup your ID</Text>
          <Image
            style={styles.loginLogo}
            source={require('../../assets/key-icon.png')}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Encryptions;
