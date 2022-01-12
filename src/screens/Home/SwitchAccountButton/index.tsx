import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AccountAvatar from '../../../components/shared/AccountAvatar';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { truncateAddress } from '../../../shared/addressUtils';
import Switch from '../../../assets/images/Home/switch.svg';
import styles from './styles';
import { withSuspense } from '../../../components/shared/WithSuspense';

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

export default withSuspense(SwitchAccountButton, <Text>Loading</Text>);
