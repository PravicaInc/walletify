import React, {useState} from 'react';

import {useDispatch} from 'react-redux';

import {
  Identity,
  IdentityNameValidityError,
  validateSubdomain,
  registerSubdomain,
  Wallet,
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
import {gaiaUrl, Subdomain} from '../../../constants';
import {doSetUsername} from '../../store/onboarding/actions';
import {didGenerateWallet} from '../../store/wallet';
import {styles} from '../CreateWallet/styles';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {popNavigation, resetNavigation} from '../../../routes';
import {useNavigation} from 'react-navigation-hooks';
import {ConfirmationPin} from '../../components/ConfirmationPin';
import {DEFAULT_PASSWORD} from '../../store/onboarding/types';
import {useWallet} from '../../hooks/useWallet';

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
  const {dispatch: navigationDispatch, getParam} = useNavigation();
  const isNewId = getParam('isNewId');
  const [showModal, setShowModal] = useState(false);
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

  const setSubmit = async () => {
    setHasAttemptedSubmit(true);
    setLoadingStatus();
    const validationErrors = await validateSubdomain(username, Subdomain);

    if (validationErrors !== null) {
      setError(validationErrors);
      setErrorStatus();
      return;
    }
    if (isNewId) {
      setHasAttemptedSubmit(false);
      setStatus('initial');
      setShowModal(true);
    } else {
      onSubmit();
    }
  };

  const onSubmit = async (password?: string) => {
    setHasAttemptedSubmit(true);
    setStatus('loading');
    setLoadingStatus();
    setShowModal(false);
    if (!wallet) {
      dispatch(doSetUsername(username));
      return;
    }

    let identity: Identity;
    let identityIndex: number;
    try {
      if (!isNewId) {
        identity = wallet.identities[0];
        identityIndex = 0;
      } else {
        identity = await wallet.createNewIdentity(password || DEFAULT_PASSWORD);
        identityIndex = wallet.identities.length - 1;
      }
      await registerSubdomain({
        username,
        subdomain: Subdomain,
        gaiaHubUrl: gaiaUrl,
        identity,
      });
      await dispatch(didGenerateWallet(wallet));
      const gaiaConfig = await wallet.createGaiaConfig(gaiaUrl);
      await wallet.getOrCreateConfig({gaiaConfig, skipUpload: true});
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
      await dispatch(didGenerateWallet(wallet));
      resetNavigation(navigationDispatch, 'Home');
      // eslint-disable-next-line no-catch-shadow
    } catch (error) {
      setShowModal(false);
      setStatus('initial');
      if (error.status === 409) {
        setError('rateLimited');
      } else {
        setError('network');
      }
      setErrorStatus();
    }
  };
  const goBack = () => popNavigation(navigationDispatch);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.container} style={styles.white}>
        <KeyboardAvoidingView behavior={'position'}>
          <View>
            {isNewId && (
              <TouchableOpacity onPress={goBack} style={styles.cardItem}>
                <Image
                  style={styles.back}
                  resizeMode="contain"
                  source={require('../../assets/back_arrow.png')}
                />
              </TouchableOpacity>
            )}
            <Image
              style={styles.imageHeader}
              source={require('../../assets/person-purple.png')}
            />
            <Text style={styles.title}>Choose Username</Text>
            <Text style={styles.description}>
              This is how people will find you in the Stacks ecosystem, choose a
              descriptive one.
            </Text>
            <TextInput
              placeholder={'Your Username'}
              autoCapitalize="none"
              placeholderTextColor={'#94A5A6'}
              style={[styles.textInput, styles.input]}
              value={username}
              onChangeText={handleInput}
            />
            <Text style={styles.stxID}>.ID.STX</Text>
            {error && hasAttemptedSubmit && (
              <Text style={styles.errorText}>{errorTextMap[error]}</Text>
            )}
          </View>
          <TouchableOpacity
            disabled={isLoading}
            onPress={setSubmit}
            style={styles.loginButton}>
            <>
              <Text style={styles.buttonText}>Continue</Text>
              {isLoading ? (
                <ActivityIndicator size={'small'} color={'white'} />
              ) : (
                <Image
                  style={styles.loginLogo}
                  source={require('../../assets/login.png')}
                />
              )}
            </>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {showModal && (
          <ConfirmationPin
            onSubmit={onSubmit}
            setShowModal={setShowModal}
            wallet={wallet as Wallet}
            showModal={showModal}
          />
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default Username;