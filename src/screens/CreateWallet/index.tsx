/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Clipboard,
  Dimensions,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {styles} from './styles';
import {useSelector} from 'react-redux';
import {TextInput} from 'react-native-gesture-handler';
import {selectSecretKey} from '../../store/onboarding/selectors';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import LottieView from 'lottie-react-native';

const CreateWallet: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const [isSaved, setSavedSecretKey] = useState(false);
  const secretKey = useSelector(selectSecretKey);
  const {dispatch} = useNavigation();
  console.warn(secretKey);
  const onSubmit = async () => {
    if (secretKey) {
      Clipboard.setString(secretKey);
      setSavedSecretKey(true);
    }
  };

  const createPin = () => {
    resetNavigation(dispatch, 'CreatePin');
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View
          style={[
            styles.container,
            {backgroundColor: secretKey ? '#F4F4F4' : 'white'},
          ]}>
          {!secretKey ? (
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 24,
                  textAlign: 'center',
                  fontWeight: 'bold',
                }}>
                Generating your secret key!
              </Text>
              <LottieView
                source={require('../../assets/securekeyanimation.json')}
                autoPlay
                loop
              />
            </View>
          ) : (
            <KeyboardAvoidingView behavior={'position'}>
              {!isSaved ? (
                <View style={styles.card}>
                  <Image
                    style={styles.imageHeader}
                    source={require('../../assets/lock-icon.png')}
                  />
                  <Text style={styles.title}>Your Secret Key</Text>
                  <Text style={styles.description}>
                    Here’s your Secret Key: 12 words that prove it’s you when
                    you want to use Pravica on a new device. Once lost it’s lost
                    forever, so save it somewhere you won’t forget.
                  </Text>
                  <Text style={{color: '#7F8C8D', marginTop: 40}}>
                    Your Secret Key
                  </Text>
                  <TextInput
                    placeholder={'Your seed phrase'}
                    placeholderTextColor={'#94A5A6'}
                    style={styles.textInput}
                    editable={false}
                    value={secretKey}
                    textAlignVertical={'center'}
                    multiline={true}
                  />
                </View>
              ) : (
                <View style={styles.card}>
                  <Image
                    style={styles.imageHeader}
                    source={require('../../assets/lock.png')}
                  />
                  <Text style={styles.title}>Save Your Secret Key</Text>
                  <View style={styles.cardItem}>
                    <Image
                      style={styles.image}
                      source={require('../../assets/file.png')}
                    />
                    <Text style={styles.description}>
                      Paste your Secret Key wherever you keep critical, private,
                      information such as passwords.
                    </Text>
                  </View>
                  <View style={styles.cardItem}>
                    <Image
                      style={styles.image}
                      source={require('../../assets/alert.png')}
                    />
                    <Text style={styles.description}>
                      Once lost, it’s lost forever. So save it somewhere you
                      won’t forget.
                    </Text>
                  </View>
                </View>
              )}
              <>
                {!isSaved && (
                  <TouchableOpacity
                    disabled={isLoading}
                    onPress={onSubmit}
                    style={styles.loginButton}>
                    <>
                      <Text style={styles.buttonText}>
                        Copy your Secret key & Go Next
                      </Text>
                      {isLoading ? (
                        <ActivityIndicator size={'small'} color={'white'} />
                      ) : (
                        <Image
                          style={styles.loginLogo}
                          source={require('../../assets/copy.png')}
                        />
                      )}
                    </>
                  </TouchableOpacity>
                )}
                {isSaved && (
                  <>
                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={createPin}
                      style={styles.loginButton}>
                      <>
                        <Text style={styles.buttonText}>I've Saved it</Text>
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
                    <TouchableOpacity
                      onPress={() => {
                        setSavedSecretKey(false);
                      }}
                      style={[
                        styles.cardItem,
                        {marginLeft: '5%', marginTop: 10},
                      ]}>
                      <Image
                        style={{width: 20, height: 12, marginRight: 16}}
                        resizeMode="contain"
                        source={require('../../assets/back_arrow.png')}
                      />
                      <Text>View secret key again</Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            </KeyboardAvoidingView>
          )}
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default CreateWallet;
