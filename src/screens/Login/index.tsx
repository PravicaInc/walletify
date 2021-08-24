/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, Text, View} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {pushNavigation, resetNavigation} from '../../../routes';
import {ScrollView} from 'react-native-gesture-handler';
import IconButton from './IconButton';

const RestoreIDButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  return (
    <IconButton
      onPress={onPress}
      buttonType={1}
      icon={require('../../assets/login-purple.png')}
      text={'Restore Your Stacks ID'}
    />
  );
};

const CreateStacksIDButton: React.FC<{onPress: () => void}> = ({onPress}) => {
  return (
    <IconButton
      onPress={onPress}
      buttonType={0}
      icon={require('../../assets/key-icon.png')}
      text={'Create Your Stacks ID'}
    />
  );
};

const Login: React.FC = () => {
  const {dispatch: navigationDispatch} = useNavigation();

  const onSubmit = () => {
    pushNavigation(navigationDispatch, {
      routeName: 'SeedPhrase',
    });
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.container} style={styles.white}>
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

        <CreateStacksIDButton
          onPress={() => resetNavigation(navigationDispatch, 'CreateWallet')}
        />
        <RestoreIDButton onPress={onSubmit} />
      </ScrollView>
    </>
  );
};

export default Login;
