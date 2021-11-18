import React, { useContext, useState, useEffect } from 'react';
import { TouchableOpacity, View, ScrollView, Switch } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { BIOMETRY_TYPE, ACCESS_CONTROL } from 'react-native-keychain';

import { Typography } from '../../components/shared/Typography';
import AccountAvatar from '../../components/shared/AccountAvatar';
import SettingsIcon from '../../assets/manage.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import EnterPasswordModal from '../../components/EnterPasswordModal';
import { ThemeContext } from '../../contexts/theme';

import BugIcon from '../../assets/images/settings/bug.svg';
import LockIcon from '../../assets/images/settings/lock.svg';
import PasswordIcon from '../../assets/images/settings/password.svg';
import QuestionMarkIcon from '../../assets/images/settings/question-mark.svg';
import SpeakIcon from '../../assets/images/settings/speak.svg';
import FingerPrintIcon from '../../assets/finger-print.svg';
import ExitIcon from '../../assets/images/settings/exit.svg';
import SecureKeychain from '../../shared/SecureKeychain';

import { styles } from './styles';

type SettingsLinkProps = {
  text: string;
  icon: React.FC;
};

const SettingsNextLink = (props: SettingsLinkProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const Icon = props.icon;

  return (
    <View style={styles.settingsLinkContainer}>
      <Icon />
      <Typography
        type="buttonText"
        style={[styles.settingsLinkText, { color: colors.secondary100 }]}>
        {props.text}
      </Typography>
    </View>
  );
};

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

const Settings = observer(() => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { dispatch } = useNavigation();

  const [enterPasswordVisible, setEnterPasswordVisible] = useState(false);

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

  const handleBiometricToggle = async () => {
    if (isBiometryEnabled) {
      await SecureKeychain.resetGenericPassword();
      setIsBiometryEnabled(false);
    } else {
      toggleEnterPassword();
    }
  };

  const toggleEnterPassword = () =>
    setEnterPasswordVisible(!enterPasswordVisible);

  const handleBioOn = async ({ password }: { password: string }) => {
    await SecureKeychain.setGenericPassword(
      password || '',
      ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    );
    setIsBiometryEnabled(true);
    toggleEnterPassword();
  };

  const handleRecoverSeedPhrase = () =>
    dispatch(StackActions.push('RecoverSeedPhrase'));

  // navigation handlers
  const handleGoBack = () => dispatch(StackActions.replace('Home'));
  const handleChangePassword = () =>
    dispatch(StackActions.push('ChangePassword'));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.white }]}>
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
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <AccountAvatar accountIndex={3} diameter={55} hasAura={true} />
            <View style={styles.cardTextContainer}>
              <Typography type="bigTitle">Account 1</Typography>
              <Typography
                type="smallTitleR"
                style={{ color: colors.primary40 }}>
                (SP6A....45G4)
              </Typography>
            </View>
          </View>
          <View
            style={[
              styles.settingsItemsContainer,
              { borderBottomColor: colors.primary20 },
            ]}>
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
              <EnterPasswordModal
                handleNextAction={handleBioOn}
                toggleEnterPassword={toggleEnterPassword}
                enterPasswordVisible={enterPasswordVisible}
              />
            </View>
            <TouchableSettingsItem
              icon={LockIcon}
              text="Recover the Seed Phrase"
              onPress={handleRecoverSeedPhrase}
            />
          </View>
          <View
            style={[
              styles.settingsItemsContainer,
              { borderBottomColor: colors.primary20 },
            ]}>
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
          <Typography
            type="buttonText"
            style={[styles.bottomText, { color: colors.failed100 }]}>
            Reset Wallet
          </Typography>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

export default Settings;
