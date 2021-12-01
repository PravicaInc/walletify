import { getAccountDisplayName } from '@stacks/wallet-sdk/dist';
import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AccountAvatar from '../../../components/shared/AccountAvatar';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { truncateAddress } from '../../../shared/addressUtils';
import Switch from '../../../assets/images/Home/switch.svg';
import switchAccountButtonStyles from './styles';

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
          selectedAccountState && getAccountDisplayName(selectedAccountState)
        }
        diameter={45}
      />
      <View>
        <Typography type="smallTitle" style={{ color: colors.primary100 }}>
          {selectedAccountState && getAccountDisplayName(selectedAccountState)}
        </Typography>
        <Typography
          type="commonText"
          style={{ color: colors.primary40, paddingTop: 6 }}>
          {`(${truncateAddress(selectedAccountState?.address, 11)})`}
        </Typography>
      </View>
      <View style={switchAccountButtonStyles.switchIconContainer}>
        <Switch />
      </View>
    </TouchableOpacity>
  );
};

export default SwitchAccountButton;
