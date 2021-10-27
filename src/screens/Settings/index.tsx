import React, { useContext, useState, useEffect } from 'react';
import {
  TouchableOpacity,
  View,
  ScrollView,
  Text,
  Image,
  Switch,
} from 'react-native';
import { StackActions, useNavigation } from '@react-navigation/native';

import { Typography } from '../../components/shared/Typography';
import RoundedImage from '../../components/shared/RoundedImage';
import SettingsIcon from '../../assets/settings.svg';
import PlaceholderImg from '../../assets/home-placeholder.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import SettingsNextLink from '../../components/SettingsNextLink';
import { CustomAppHeader } from '../../components/CustomAppHeader';
import { ThemeContext } from '../../contexts/theme';

import BugIcon from '../../assets/images/settings/bug.svg';
import LockIcon from '../../assets/images/settings/lock.svg';
import PasswordIcon from '../../assets/images/settings/password.svg';
import QuestionMarkIcon from '../../assets/images/settings/question-mark.svg';
import SpeakIcon from '../../assets/images/settings/speak.svg';
import FingerPrintIcon from '../../assets/finger-print.svg';
import ExitIcon from '../../assets/images/settings/exit.svg';
import SecureKeychain from '../../shared/SecureKeychain';
import { BIOMETRY_TYPE, ACCESS_CONTROL } from 'react-native-keychain';

import { styles } from './styles';

type Props = {
  icon: React.FC;
  text: string;
};

const TouchableSettingsItem = (props: Props) => {
  const SettingIcon = props.icon;
  return (
    <TouchableOpacity>
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

const Settings: React.FC = observer(() => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { dispatch } = useNavigation();

  // biometrics
  const { uiStore } = useStores();
  const { isBiometryEnabled, setIsBiometryEnabled } = uiStore;
  const [isBioSwitchOn, setisBioSwitchOn] = useState(isBiometryEnabled);
  const [hasBioSetup, setHasBioSetup] = useState<BIOMETRY_TYPE | null>(null);
  const getBioSetup = async () => {
    const type = await SecureKeychain.getSupportedBiometryType();
    setHasBioSetup(type);
  };
  useEffect(() => {
    getBioSetup();
  }, []);

  const handleGoBack = () => dispatch(StackActions.pop());

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
          <CustomAppHeader
            handleGoBack={handleGoBack}
            containerStyle={styles.header}
            backColor={colors.primary100}
            noBackText
            customBack={
              <Typography type="bigTitle" style={{ color: colors.primary100 }}>
                Settings
              </Typography>
            }
            customNext={
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
            <TouchableSettingsItem icon={PasswordIcon} text="Change Password" />
            <View style={[styles.settingsItem, styles.bioSetting]}>
              <View style={styles.bioSettingLeft}>
                <FingerPrintIcon />
                <Typography type="buttonText" style={styles.settingsItemText}>
                  Sign With Biometrics
                </Typography>
              </View>
              <Switch
                onChange={() => setisBioSwitchOn(prevState => !prevState)}
                value={isBioSwitchOn}
                disabled={!hasBioSetup}
              />
            </View>
            <TouchableSettingsItem
              icon={LockIcon}
              text="Recover the Seed Phrase"
            />
          </View>
          <View style={settingsItemsContainerStyle}>
            {bottomSettingsList.map(item => (
              <TouchableSettingsItem icon={item.icon} text={item.text} />
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
