/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect} from 'react';
import {Text, ActivityIndicator, ImageBackground} from 'react-native';
import {styles} from './styles';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import {theme} from '../../../theme';
import {useSelector} from 'react-redux';
import {selectCurrentWallet} from '../../store/wallet/selectors';
import {selectSecretKey} from '../../store/onboarding/selectors';

const SplashScreen: React.FC = () => {
  const wallet = useSelector(selectCurrentWallet);
  const secretKey = useSelector(selectSecretKey);
  const {dispatch} = useNavigation();
  useEffect(() => {
    if (wallet) {
      if (wallet.identities[0].usernames.length === 0) {
        resetNavigation(dispatch, 'Username');
      } else {
        resetNavigation(dispatch, 'Home');
      }
    } else if (!secretKey && wallet) {
      resetNavigation(dispatch, 'CreatePin');
    } else {
      resetNavigation(dispatch, 'Login');
    }
  }, [wallet]);
  return (
    <>
      <ImageBackground
        source={require('../../assets/pravica-background.png')}
        style={styles.container}>
        {/* <Image style={styles.logo} source={require('../../assets/logo.png')} /> */}
        <ActivityIndicator size="large" color={theme.colors.white} />
        <Text style={styles.bottomText}>
          All rights reserved to{' '}
          <Text style={styles.pravicaText}>@Pravica</Text>
        </Text>
      </ImageBackground>
    </>
  );
};

export default SplashScreen;
