/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  Clipboard,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {styles} from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, TextInput} from 'react-native-gesture-handler';
import {selectSecretKey} from '../../store/onboarding/selectors';
import {useNavigation} from 'react-navigation-hooks';
import {resetNavigation} from '../../../routes';
import LottieView from 'lottie-react-native';
import {doCreateSecretKey} from '../../store/onboarding/actions';
import {isWideScreen} from '../../utils';

const CreateWallet: React.FC = () => {
  const [isSaved, setSavedSecretKey] = useState(false);
  const secretKey = useSelector(selectSecretKey);
  const {dispatch} = useNavigation();
  const dispatchAction = useDispatch();

  const onSubmit = async () => {
    if (secretKey) {
      Clipboard.setString(secretKey);
      setSavedSecretKey(true);
    }
  };

  useEffect(() => {
    const timeOut = setTimeout(() => {
      dispatchAction(doCreateSecretKey());
    }, 3000);
    return () => clearTimeout(timeOut);
  }, []);

  const createPin = () => {
    resetNavigation(dispatch, 'CreatePin');
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          style={styles.white}>
          {!secretKey ? (
            <View style={styles.animationView}>
              <LottieView
                source={require('../../assets/securekeyanimation.min.json')}
                autoPlay
                loop
                autoSize
              />
              <Text style={styles.text}>
                Your decentralized identity is being created locally, No one can
                access your keys.
              </Text>
            </View>
          ) : (
            <KeyboardAvoidingView behavior={'position'}>
              {!isSaved ? (
                <View>
                  <Image
                    style={styles.imageHeader}
                    source={require('../../assets/lock-icon.png')}
                  />
                  <Text style={styles.title}>Your Stacks ID</Text>
                  <Text style={styles.description}>
                    Here’s your seed phrase: 24 words that prove it’s you when
                    you want to use WISE on a new device. Once lost it’s lost
                    forever, so save it somewhere you won’t forget.
                  </Text>
                  <Text style={styles.phraseText}>Your Seed Phrase</Text>
                  <TextInput
                    placeholder={'Your seed phrase'}
                    placeholderTextColor={'black'}
                    style={styles.textInput}
                    editable={false}
                    value={secretKey}
                    textAlignVertical={'center'}
                    multiline={true}
                  />
                </View>
              ) : (
                <View>
                  <Image
                    style={styles.imageHeader}
                    source={require('../../assets/lock-icon.png')}
                  />
                  <Text style={styles.title}>Save Your Seed Phrase</Text>
                  <View>
                    <View style={styles.cardItem}>
                      <Image
                        style={styles.image}
                        source={require('../../assets/file.png')}
                      />
                      <Text style={styles.description}>
                        Paste your seed phrase wherever you keep critical and
                        private information such as passwords.
                      </Text>
                    </View>
                    <View style={styles.cardItem}>
                      <Image
                        style={styles.image}
                        source={require('../../assets/alert.png')}
                      />
                      <Text style={styles.description}>
                        Once lost, it’s lost forever. So save it somewhere you
                        won’t forget. Highly recommended to save in a
                        non-digital way.
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              <>
                {!isSaved && (
                  <TouchableOpacity
                    onPress={onSubmit}
                    style={styles.loginButton}>
                    <>
                      <Text style={styles.buttonText}>
                        Copy your seed phrase
                      </Text>
                      <Image
                        style={styles.loginLogo}
                        source={require('../../assets/copy.png')}
                      />
                    </>
                  </TouchableOpacity>
                )}
                {isSaved && (
                  <>
                    <TouchableOpacity
                      onPress={createPin}
                      style={styles.loginButton}>
                      <>
                        <Text style={styles.buttonText}>I've Saved it</Text>
                        <Image
                          style={styles.loginLogo}
                          source={require('../../assets/login.png')}
                        />
                      </>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setSavedSecretKey(false);
                      }}
                      style={[
                        styles.cardItem,
                        {marginTop: isWideScreen ? 50 : 20},
                      ]}>
                      <Image
                        style={styles.back}
                        resizeMode="contain"
                        source={require('../../assets/back_arrow_blue.png')}
                      />
                      <Text style={styles.viewSecretKeyText}>
                        View secret key again
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </>
            </KeyboardAvoidingView>
          )}
        </ScrollView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default CreateWallet;
