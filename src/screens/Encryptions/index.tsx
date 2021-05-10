/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {styles} from './styles';
import {HeaderComponent} from '../../components/Header';
import {pushNavigation, resetNavigation} from '../../../routes';
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
        <Text>
          Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in
          laying out print, graphic or web designs
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
