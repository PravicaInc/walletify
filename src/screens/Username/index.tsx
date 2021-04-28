import React, {useState} from 'react';

import {useDispatch} from 'react-redux';

import {
  DEFAULT_PROFILE,
  Identity,
  IdentityKeyPair,
  IdentityNameValidityError,
  Profile,
  registrars,
  validateSubdomain,
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
import {doSetUsername} from '../../store/onboarding/actions';
import {didGenerateWallet} from '../../store/wallet';
import {styles} from '../CreateWallet/styles';
import {TextInput} from 'react-native-gesture-handler';
import {resetNavigation} from '../../../routes';
import {theme} from '../../../theme';
import {connectToGaiaHub} from '@stacks/storage';
import * as c32check from 'c32check';
import {makeZoneFile} from 'zone-file';
import {decodeToken, SECP256K1Client, TokenSigner} from 'jsontokens';
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
    // let identityIndex: number;
    identity = wallet.identities[0];
    // identityIndex = 0;
    try {
      await registerSubdomain({
        username,
        subdomain: Subdomain,
        gaiaHubUrl: gaiaUrl,
        identity,
      });
      await dispatch(didGenerateWallet(wallet));
      // await dispatch(doFinishSignIn({identityIndex}));
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

export async function uploadProfile({
  gaiaHubUrl,
  filePath,
  identity,
  signedProfileTokenData,
  gaiaHubConfig,
}: {
  gaiaHubUrl: string;
  filePath: string;
  identity: Identity;
  signedProfileTokenData: string;
  gaiaHubConfig?: any;
}): Promise<string> {
  const identityHubConfig =
    gaiaHubConfig || (await connectToGaiaHub(gaiaHubUrl, identity.keyPair.key));
  return await uploadToGaiaHub(
    filePath,
    signedProfileTokenData,
    identityHubConfig,
  );
}
interface GaiaHubConfig {
  address: string;
  url_prefix: string;
  token: string;
  max_file_upload_size_megabytes: number | undefined;
  server: string;
}
const uploadToGaiaHub = async (
  filename: string,
  contents: Blob | Buffer | ArrayBufferView | string,
  hubConfig: GaiaHubConfig,
): Promise<string> => {
  const contentType = 'application/json';

  const response = await fetch(
    `${hubConfig.server}/store/${hubConfig.address}/${filename}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': contentType,
        Authorization: `bearer ${hubConfig.token}`,
      },
      body: contents,
      referrer: 'no-referrer',
      referrerPolicy: 'no-referrer',
    },
  );
  const {publicURL} = await response.json();
  return publicURL;
};

const DEFAULT_PROFILE_FILE_NAME = 'profile.json';

export const registerSubdomain = async ({
  identity,
  gaiaHubUrl,
  username,
  subdomain,
}: any) => {
  const profile = identity.profile || DEFAULT_PROFILE;
  const signedProfileTokenData = signProfileForUpload(
    profile,
    identity.keyPair,
  );
  const profileUrl = await uploadProfile({
    gaiaHubUrl,
    filePath: DEFAULT_PROFILE_FILE_NAME,
    identity,
    signedProfileTokenData,
  });
  const fullUsername = `${username}.${subdomain}`;
  const zoneFile = makeProfileZoneFile(fullUsername, profileUrl);
  await sendUsernameToRegistrar({
    username,
    subdomain,
    zoneFile,
    identity,
  });
  identity.defaultUsername = fullUsername;
  identity.usernames.push(fullUsername);
  return identity;
};

function signProfileForUpload(
  profile: Profile,
  keypair: IdentityKeyPair,
): string {
  const privateKey = keypair.key;
  const publicKey = keypair.keyID;

  const token = signProfileToken(profile, privateKey, {publicKey});
  const tokenRecord = wrapProfileToken(token);
  const tokenRecords = [tokenRecord];
  return JSON.stringify(tokenRecords, null, 2);
}
function wrapProfileToken(token: string) {
  return {
    token,
    decodedToken: decodeToken(token),
  };
}

function signProfileToken(
  profile: any,
  privateKey: string,
  subject?: any,
  issuer?: any,
  signingAlgorithm = 'ES256K',
  issuedAt = new Date(),
  expiresAt = nextYear(),
): string {
  if (signingAlgorithm !== 'ES256K') {
    throw new Error('Signing algorithm not supported');
  }

  const publicKey = SECP256K1Client.derivePublicKey(privateKey);

  if (!subject) {
    subject = {publicKey};
  }

  if (!issuer) {
    issuer = {publicKey};
  }

  const tokenSigner = new TokenSigner(signingAlgorithm, privateKey);

  const payload = {
    jti: makeUUID4(),
    iat: issuedAt.toISOString(),
    exp: expiresAt.toISOString(),
    subject,
    issuer,
    claim: profile,
  };

  return tokenSigner.sign(payload);
}
function nextYear() {
  return new Date(new Date().setFullYear(new Date().getFullYear() + 1));
}
function makeUUID4() {
  let d = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const sendUsernameToRegistrar = async ({
  username,
  subdomain,
  zoneFile,
  identity,
}: any) => {
  const {registerUrl, apiKey, addressVersion} = registrars[subdomain];
  const registrationRequestBody = JSON.stringify({
    name: username,
    owner_address: c32check.b58ToC32(identity.address, addressVersion),
    zonefile: zoneFile,
  });

  const headers = new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
  if (apiKey) {
    headers.set('Authorization', `bearer ${apiKey}`);
  }

  const response = await fetch(registerUrl, {
    method: 'POST',
    headers,
    body: registrationRequestBody,
  });

  if (!response.ok) {
    return Promise.reject({
      error: 'Failed to register username',
      status: response.status,
    });
  }

  return response.json();
};
function makeProfileZoneFile(origin: string, tokenFileUrl: string): string {
  if (tokenFileUrl.indexOf('://') < 0) {
    throw new Error('Invalid token file url');
  }

  const urlScheme = tokenFileUrl.split('://')[0];
  const urlParts = tokenFileUrl.split('://')[1].split('/');
  const domain = urlParts[0];
  const pathname = `/${urlParts.slice(1).join('/')}`;

  const zoneFile = {
    $origin: origin,
    $ttl: 3600,
    uri: [
      {
        name: '_http._tcp',
        priority: 10,
        weight: 1,
        target: `${urlScheme}://${domain}${pathname}`,
      },
    ],
  };

  const zoneFileTemplate = '{$origin}\n{$ttl}\n{uri}\n';

  return makeZoneFile(zoneFile, zoneFileTemplate);
}
