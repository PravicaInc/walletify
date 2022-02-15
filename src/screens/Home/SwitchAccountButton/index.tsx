import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import AccountAvatar from '../../../components/shared/AccountAvatar';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { truncateAddress } from '../../../shared/addressUtils';
import Switch from '../../../assets/images/Home/switch.svg';
import styles from './styles';

interface SwitchAccountButtonProps {
  handlePressSwitchAccount: () => void;
}

const SwitchAccountButton: React.FC<SwitchAccountButtonProps> = props => {
  const { handlePressSwitchAccount } = props;
  const { selectedAccountState, walletAccounts } = useAccounts();
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const accountName =
    selectedAccountState?.username ||
    `Account ${selectedAccountState ? selectedAccountState?.index + 1 : 0}`;

  if (selectedAccountState === undefined) {
    return (
      <View
        style={[
          styles.buttonContainer,
          {
            backgroundColor: colors.card,
          },
        ]}>
        <ContentLoader
          speed={2}
          width={200}
          height={40}
          viewBox="0 0 200 40"
          backgroundColor={colors.darkgray}
          foregroundColor={colors.white}>
          <Rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
          <Rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
          <Circle cx="20" cy="20" r="20" />
        </ContentLoader>
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={handlePressSwitchAccount}
      activeOpacity={0.5}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <AccountAvatar accountName={accountName} diameter={45} />
      <View style={styles.accountInfo}>
        <Typography
          numberOfLines={1}
          type="smallTitle"
          style={[styles.accountName, { color: colors.primary100 }]}>
          {accountName}
        </Typography>
        <Typography
          type="commonText"
          style={[styles.address, { color: colors.primary40 }]}>
          {`(${
            selectedAccountState?.address
              ? truncateAddress(selectedAccountState?.address, 11)
              : '....'
          })`}
        </Typography>
      </View>
      {(walletAccounts?.length || 0) > 1 && (
        <View style={styles.switchIconContainer}>
          <Typography
            type="commonText"
            style={[styles.switchText, { color: colors.secondary100 }]}>
            Switch
          </Typography>
          <Switch />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default SwitchAccountButton;
