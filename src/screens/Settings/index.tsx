import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View, ScrollView, Switch } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { BIOMETRY_TYPE, ACCESS_CONTROL } from 'react-native-keychain';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Typography } from '../../components/shared/Typography';
import RoundedImage from '../../components/shared/RoundedImage';
import SettingsIcon from '../../assets/settings.svg';
import PlaceholderImg from '../../assets/home-placeholder.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import SettingsNextLink from '../../components/SettingsNextLink';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import { ThemeContext } from '../../contexts/theme';

import BugIcon from '../../assets/images/settings/bug.svg';
import LockIcon from '../../assets/images/settings/lock.svg';
import PasswordIcon from '../../assets/images/settings/password.svg';
import QuestionMarkIcon from '../../assets/images/settings/question-mark.svg';
import SpeakIcon from '../../assets/images/settings/speak.svg';
import FingerPrintIcon from '../../assets/finger-print.svg';
import ExitIcon from '../../assets/images/settings/exit.svg';
import SecureKeychain from '../../shared/SecureKeychain';
import { RootStackParamList } from '../../navigation/types';

import { styles } from './styles';

type TProps = {
  icon: React.FC;
  text: string;
  onPress?: () => void;
};

const TouchableSettingsItem = (props: TProps) => {
  const SettingIcon = props.icon;
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.settingsItem}>
        <SettingIcon />
        <Typography type="buttonText" style={styles.settingsItemText}>
          {props.text}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const bottomSettingsList = [
  { icon: SpeakIcon, text: 'Request a Feature' },
  { icon: QuestionMarkIcon, text: 'Ask a Question' },
  { icon: BugIcon, text: 'Report a Bug' },
];

type SProps = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const Settings = observer((props: SProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { dispatch } = useNavigation();

  const password = props.route.params?.password;

  // biometrics
  const { uiStore } = useStores();
  const { isBiometryEnabled, setIsBiometryEnabled } = uiStore;
  const [hasBioSetup, setHasBioSetup] = useState<BIOMETRY_TYPE | null>(null);

  useEffect(() => {
    const getBioSetup = async () => {
      const type = await SecureKeychain.getSupportedBiometryType();
      setHasBioSetup(type);
    };
    getBioSetup();
  }, []);

  useEffect(() => {
    const updateBio = async () => {
      await SecureKeychain.setGenericPassword(
        password || '',
        ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      );
      setIsBiometryEnabled(true);
    };
    if (password && password.length > 0) {
      updateBio();
    }
  }, [password]);

  const handleBiometricToggle = async () => {
    if (isBiometryEnabled) {
      await SecureKeychain.resetGenericPassword();
      setIsBiometryEnabled(false);
    } else {
      dispatch(StackActions.push('EnterPassword', { nextScreen: 'Settings' }));
    }
  };

  const handleRecoverSeedPhrase = () =>
    dispatch(StackActions.push('ShowSeedPhrase'));

  // navigation handlers
  const handleGoBack = () => dispatch(StackActions.replace('Home'));
  const handleChangePassword = () =>
    dispatch(StackActions.push('ChangePassword'));

  const containerStyle = [styles.container, { backgroundColor: colors.white }];
  const cardStyle = [styles.card, { backgroundColor: colors.card }];
  const cardSubtitleStyle = { color: colors.primary40 };
  const settingsItemsContainerStyle = [
    styles.settingsItemsContainer,
    { borderBottomColor: colors.primary20 },
  ];
  const bottomTextStyle = [styles.bottomText, { color: colors.failed100 }];

  return (
    <SafeAreaView style={containerStyle}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.topContent}>
          <Header
            leftComponent={
              <HeaderBack
                onPress={handleGoBack}
                text="Settings"
                textType="bigTitle"
                hasChevron
                chevronSize={{ width: 9, height: 16.2 }}
              />
            }
            rightComponent={
              <SettingsNextLink text="Manage Accounts" icon={SettingsIcon} />
            }
          />
          {/* Card component start*/}
          <View style={cardStyle}>
            <RoundedImage image={PlaceholderImg} diameter={55} hasAura={true} />
            <View style={styles.cardTextContainer}>
              <Typography type="bigTitle">Account 1</Typography>
              <Typography type="smallTitleR" style={cardSubtitleStyle}>
                (SP6A....45G4)
              </Typography>
            </View>
          </View>
          {/* Card component end*/}
          <View style={settingsItemsContainerStyle}>
            <TouchableSettingsItem
              icon={PasswordIcon}
              text="Change Password"
              onPress={handleChangePassword}
            />
            <View style={[styles.settingsItem, styles.bioSetting]}>
              <View style={styles.bioSettingLeft}>
                <FingerPrintIcon />
                <Typography type="buttonText" style={styles.settingsItemText}>
                  Sign With Biometrics
                </Typography>
              </View>
              <Switch
                onChange={handleBiometricToggle}
                value={isBiometryEnabled}
                disabled={!hasBioSetup}
              />
            </View>
            <TouchableSettingsItem
              icon={LockIcon}
              text="Recover the Seed Phrase"
              onPress={handleRecoverSeedPhrase}
            />
          </View>
          <View style={settingsItemsContainerStyle}>
            {bottomSettingsList.map(item => (
              <TouchableSettingsItem
                key={item.text}
                icon={item.icon}
                text={item.text}
              />
            ))}
          </View>
        </View>
        <View style={styles.bottomContent}>
          <ExitIcon />
          <Typography type="buttonText" style={bottomTextStyle}>
            Reset Wallet
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default Settings;
