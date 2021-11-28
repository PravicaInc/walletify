import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { TouchableOpacity, View, ScrollView, Switch } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { BIOMETRY_TYPE, ACCESS_CONTROL } from 'react-native-keychain';
import ConfirmModal from '../../components/ConfirmModal';
import { Typography } from '../../components/shared/Typography';
import AccountAvatar from '../../components/shared/AccountAvatar';
import SettingsIcon from '../../assets/manage.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import EnterPasswordModal from '../../components/EnterPasswordModal';
import { ThemeContext } from '../../contexts/Theme/theme';
import { UserPreferenceContext } from '../../contexts/UserPreference/userPreferenceContext';
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

const Settings = () => {
  const enterPasswordModalRef = useRef<BottomSheetModal>(null);
  const confirmModalRef = useRef<BottomSheetModal>(null);

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const handlePresentEnterPassword = useCallback(() => {
    enterPasswordModalRef.current?.present();
  }, []);

  const handlePresentResetWallet = useCallback(() => {
    confirmModalRef.current?.present();
  }, []);

  const { dispatch } = useNavigation();

  // biometrics
  const {
    userPreference: { hasSetBiometric },
    setHasEnabledBiometric,
    clearUserPreference,
  } = useContext(UserPreferenceContext);
  const [hasBioSetup, setHasBioSetup] = useState<BIOMETRY_TYPE | null>(null);

  useEffect(() => {
    const getBioSetup = async () => {
      const type = await SecureKeychain.getSupportedBiometryType();
      setHasBioSetup(type);
    };
    getBioSetup();
  }, []);

  const handleBiometricToggle = async () => {
    if (hasSetBiometric) {
      await SecureKeychain.resetGenericPassword();
      setHasEnabledBiometric(false);
    } else {
      handlePresentEnterPassword();
    }
  };

  const confirmContinue = useCallback(
    () => (
      <Typography type="buttonText" style={{ color: colors.failed100 }}>
        OK Reset
      </Typography>
    ),
    [colors.failed100],
  );

  const confirmAbort = useCallback(
    () => (
      <Typography type="smallTitle" style={{ color: colors.secondary100 }}>
        Cancel
      </Typography>
    ),
    [colors.secondary100],
  );

  const handleBioOn = async ({ password }: { password: string }) => {
    await SecureKeychain.setGenericPassword(
      password || '',
      ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    );
    setHasEnabledBiometric(true);
  };

  const handleRecoverSeedPhrase = () =>
    dispatch(StackActions.push('RecoverSeedPhrase'));

  // navigation handlers
  const handleGoBack = () => dispatch(StackActions.pop());
  const handleChangePassword = () =>
    dispatch(StackActions.push('ChangePassword'));

  const handleResetWallet = () => {
    confirmModalRef.current?.dismiss();
    clearUserPreference();
    dispatch(StackActions.replace('Onboarding'));
  };

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
                value={hasSetBiometric}
                disabled={!hasBioSetup}
              />
              <EnterPasswordModal
                ref={enterPasswordModalRef}
                handleNextAction={handleBioOn}
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
        <TouchableOpacity
          style={styles.bottomContent}
          onPress={handlePresentResetWallet}>
          <ExitIcon />
          <Typography
            type="buttonText"
            style={[styles.bottomText, { color: colors.failed100 }]}>
            Reset Wallet
          </Typography>
        </TouchableOpacity>
        <ConfirmModal
          ref={confirmModalRef}
          handleNextAction={handleResetWallet}
          title="Reset Wallet"
          description="Losing the password doesn't matter as much, because as long as you have the Secret Key you can restore your wallet and set up a new password."
          renderContinueText={confirmContinue}
          renderAbortText={confirmAbort}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
