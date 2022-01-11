import React, { useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import AccountAvatar from '../../../components/shared/AccountAvatar';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { truncateAddress } from '../../../shared/addressUtils';
import Switch from '../../../assets/images/Home/switch.svg';
import switchAccountButtonStyles from './styles';
import { withSuspense } from '../../../components/shared/WithSuspense';

interface SwitchAccountButtonProps {
  handlePressSwitchAccount: () => void;
}

const SwitchAccountButton: React.FC<SwitchAccountButtonProps> = props => {
  const { handlePressSwitchAccount } = props;
  const { selectedAccountState } = useAccounts();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={handlePressSwitchAccount}
      activeOpacity={0.5}
      style={[
        switchAccountButtonStyles.buttonContainer,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <AccountAvatar
        accountName={
          selectedAccountState?.username ||
          `Account ${
            selectedAccountState ? selectedAccountState?.index + 1 : 0
          }`
        }
        diameter={45}
      />
      <View style={switchAccountButtonStyles.accountInfo}>
        <Typography
          numberOfLines={1}
          type="smallTitle"
          style={[
            switchAccountButtonStyles.accountName,
            { color: colors.primary100 },
          ]}>
          {selectedAccountState?.username ||
            `Account ${
              selectedAccountState ? selectedAccountState?.index + 1 : 0
            }`}
        </Typography>
        <Typography
          type="commonText"
          style={[
            switchAccountButtonStyles.address,
            { color: colors.primary40 },
          ]}>
          {`(${
            selectedAccountState?.address
              ? truncateAddress(selectedAccountState?.address, 11)
              : '....'
          })`}
        </Typography>
      </View>
      <View style={switchAccountButtonStyles.switchIconContainer}>
        <Switch />
      </View>
    </TouchableOpacity>
  );
};

export default withSuspense(SwitchAccountButton, <Text>Loading</Text>);
