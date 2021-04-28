import React, {useState} from 'react';

import {useDispatch} from 'react-redux';

import {
  Identity,
  IdentityNameValidityError,
  validateSubdomain,
  registerSubdomain,
} from '@stacks/keychain';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useWallet} from '../../hooks/useWallet';
import {gaiaUrl, Subdomain} from '../../../constants';
import {doFinishSignIn, doSetUsername} from '../../store/onboarding/actions';
import {didGenerateWallet} from '../../store/wallet';
import {styles} from '../CreateWallet/styles';
import {TextInput} from 'react-native-gesture-handler';
import {resetNavigation} from '../../../routes';
import {theme} from '../../../theme';
import {useNavigation} from 'react-navigation-hooks';

const identityNameLengthError =
  'Your username should be at least 8 characters, with a maximum of 37 characters.';
const identityNameIllegalCharError =
  'You can only use lowercase letters (a–z), numbers (0–9), and underscores (_).';
const identityNameUnavailableError = 'This username is not available';
const rateLimitedError =
  'You’ve tried to register too many usernames on this network. Please try again on a different network.';
const netWorkError = 'A network error was encountered.';

type ErrorReason = 'network' | 'rateLimited';
const errorTextMap = {
  [IdentityNameValidityError.MINIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.MAXIMUM_LENGTH]: identityNameLengthError,
  [IdentityNameValidityError.ILLEGAL_CHARACTER]: identityNameIllegalCharError,
  [IdentityNameValidityError.UNAVAILABLE]: identityNameUnavailableError,
  network: netWorkError,
  rateLimited: rateLimitedError,
};

const Username: React.FC<{}> = () => {
  const {wallet} = useWallet();
  const dispatch = useDispatch();
  const {dispatch: navigationDispatch} = useNavigation();

  const [error, setError] = useState<
    IdentityNameValidityError | ErrorReason | null
  >(null);
  const [status, setStatus] = useState('initial');
  const setLoadingStatus = () => setStatus('loading');
  const setErrorStatus = () => setStatus('error');

  const isLoading = status === 'loading';

  const [username, setUsername] = useState('');
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const handleInput = (value: string) => {
    setError(null);
    setUsername(value || '');
  };

  const onSubmit = async () => {
    setHasAttemptedSubmit(true);
    setLoadingStatus();

    const validationErrors = await validateSubdomain(username, Subdomain);

    if (validationErrors !== null) {
      setError(validationErrors);
      setErrorStatus();
      return;
    }
    if (!wallet) {
      dispatch(doSetUsername(username));
      return;
    }

    let identity: Identity;
    let identityIndex: number;
    identity = wallet.identities[0];
    identityIndex = 0;
    try {
      await registerSubdomain({
        username,
        subdomain: Subdomain,
        gaiaHubUrl: gaiaUrl,
        identity,
      });
      await dispatch(didGenerateWallet(wallet));
      const gaiaConfig = await wallet.createGaiaConfig(gaiaUrl);
      await wallet.getOrCreateConfig({ gaiaConfig, skipUpload: true });
      await wallet.updateConfigWithAuth({
        identityIndex,
        gaiaConfig,
        app: {
          origin: 'https://app.pravica.io',
          lastLoginAt: new Date().getTime(),
          scopes: ['store_write', 'publish_data'],
          appIcon: 'https://app.pravica.io/new-logo.png',
          name: 'Pravica',
        },
      });
      resetNavigation(navigationDispatch, 'Home');
    } catch (error) {
      if (error.status === 409) {
        setError('rateLimited');
      } else {
        setError('network');
      }
      setErrorStatus();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[styles.container, {backgroundColor: '#F4F4F4'}]}>
        <KeyboardAvoidingView behavior={'position'}>
          <View style={styles.card}>
            <Image
              style={styles.imageHeader}
              source={require('../../assets/username-registration.png')}
            />
            <Text style={styles.title}>Choose user name</Text>
            <Text style={styles.description}>
              This is how people will find you in Pravica and other apps you use
              with your Secret Key.
            </Text>
            <TextInput
              placeholder={'Your username'}
              autoCapitalize="none"
              placeholderTextColor={'#94A5A6'}
              style={[
                styles.textInput,
                {
                  height: 48,
                  borderRadius: 4,
                  backgroundColor: 'white',
                  borderWidth: 1,
                  borderColor: '#707070',
                  paddingTop: 0,
                  paddingBottom: 0,
                },
              ]}
              value={username}
              onChangeText={handleInput}
            />
            {error && hasAttemptedSubmit && (
              <Text
                style={{
                  fontSize: 14,
                  marginTop: 8,
                  color: theme.colors.danger,
                }}>
                {errorTextMap[error]}
              </Text>
            )}
          </View>
          <TouchableOpacity
            disabled={isLoading}
            onPress={onSubmit}
            style={styles.loginButton}>
            <>
              <Text style={styles.buttonText}>Continue</Text>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={'white'} />
              ) : (
                <Image
                  style={styles.loginLogo}
                  source={require('../../assets/right-arrow.png')}
                />
              )}
            </>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Username;
