import React, {
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { TouchableOpacity, View, ScrollView, Switch } from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';
import { BIOMETRY_TYPE, ACCESS_CONTROL } from 'react-native-keychain';
import { Typography } from '../../components/shared/Typography';
import Manage from '../../assets/images/settings/manage.svg';
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
import { OptionsPick } from '../../components/OptionsPick';
import WarningIcon from '../../components/shared/WarningIcon';
import { useUnlockWallet } from '../../hooks/useWallet/useUnlockWallet';
import { decryptMnemonic } from '@stacks/encryption';
import { encrypt } from '@stacks/wallet-sdk/dist';

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
  const { dispatch } = useNavigation();
  const {
    userPreference: { hasSetBiometric, encryptedSeedPhrase },
    setHasEnabledBiometric,
    clearUserPreference,
    setEncryptedSeed,
  } = useContext(UserPreferenceContext);
  const [hasBioSetup, setHasBioSetup] = useState<BIOMETRY_TYPE | null>(null);

  const handleBioOn = async (password: string) => {
    await SecureKeychain.setGenericPassword(
      password || '',
      ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
    );
    setHasEnabledBiometric(true);
    enterPasswordModalRef.current?.close();
  };

  const { validateUserCredentials } = useUnlockWallet(
    handleBioOn,
    enterPasswordModalRef,
  );
  useEffect(() => {
    const getBioSetup = async () => {
      const type = await SecureKeychain.getSupportedBiometryType();
      setHasBioSetup(type);
    };
    getBioSetup();
  }, []);

  const handlePresentEnterPassword = useCallback(() => {
    enterPasswordModalRef.current?.snapToIndex(0);
  }, []);

  const handleBiometricToggle = async () => {
    if (hasSetBiometric) {
      await SecureKeychain.resetGenericPassword();
      setHasEnabledBiometric(false);
    } else {
      handlePresentEnterPassword();
    }
  };

  const handleRecoverSeedPhrase = () => {
    dispatch(StackActions.push('RecoverSeedPhrase'));
  };

  const handleOpenManageAccounts = () => {
    dispatch(StackActions.push('ManageAccounts'));
  };

  const handleGoBack = () => dispatch(StackActions.pop());
  const handleChangePassword = () =>
    dispatch(
      StackActions.push('CreatePassword', {
        handleEditPassword: async (
          oldPassword: string,
          newPassword: string,
        ) => {
          try {
            const decryptedSeedPhrase = await decryptMnemonic(
              encryptedSeedPhrase,
              oldPassword,
            );
            if (hasSetBiometric) {
              await SecureKeychain.setGenericPassword(
                newPassword,
                ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
              );
            }
            const newCipherEncryptedSeedPhrase = await encrypt(
              decryptedSeedPhrase,
              newPassword,
            );
            const newEncryptedSeedPhrase =
              newCipherEncryptedSeedPhrase.toString('hex');
            setEncryptedSeed(newEncryptedSeedPhrase);
            dispatch(StackActions.pop());
          } catch (e) {
            throw Error('The password is incorrect!');
          }
        },
      }),
    );

  const handleResetWallet = () => {
    confirmModalRef.current?.collapse();
    clearUserPreference();
    dispatch(StackActions.replace('WalletSetup'));
  };

  const options = useMemo(() => {
    return [
      {
        label: 'OK Reset',
        onClick: handleResetWallet,
        optionTextStyle: {
          color: colors.failed100,
        },
      },
    ];
  }, [colors, handleResetWallet]);

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
          />
          <View
            style={[
              styles.settingsItemsContainer,
              { borderBottomColor: colors.primary20 },
            ]}>
            <TouchableSettingsItem
              icon={Manage}
              text="Manage Accounts"
              onPress={handleOpenManageAccounts}
            />
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
            style={[{ borderBottomColor: colors.primary20, width: '100%' }]}>
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
          onPress={validateUserCredentials}>
          <ExitIcon />
          <Typography
            type="buttonText"
            style={[styles.bottomText, { color: colors.failed100 }]}>
            Reset Wallet
          </Typography>
        </TouchableOpacity>
        <OptionsPick
          options={options}
          userIcon={<WarningIcon width={80} height={80} />}
          title="Reset Wallet"
          subTitle="Losing the password doesn't matter as much, because as long as you have the Secret Key you can restore your wallet and set up a new password."
          ref={confirmModalRef}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
