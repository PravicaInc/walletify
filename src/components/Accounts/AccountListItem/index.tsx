import React, { useContext } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { getAccountDisplayName } from '@stacks/wallet-sdk/dist';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { Typography } from '../../shared/Typography';
import Check from '../../../assets/images/check.svg';
import AccountAvatar from '../../shared/AccountAvatar';
import { AccountWithAddress } from '../../../models/account';
import accountListItemStyles from './styles';
import { truncateAddress } from '../../../shared/addressUtils';
import { useAccountAvailableStxBalance } from '../../../hooks/useAccounts/useAccounts';
import { valueFromBalance } from '../../../shared/balanceUtils';
import { useStxPriceValue } from '../../../hooks/useStxPrice/useStxPrice';

interface AccountProps {
  account: AccountWithAddress;
  onPressAccount: (accountIndex: number) => void;
  isSelected: boolean;
}

const AccountListItem: React.FC<AccountProps> = props => {
  const { account, onPressAccount, isSelected } = props;
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const handlePressAccount = () => {
    onPressAccount(account.index);
  };

  const accountStxBalance = useAccountAvailableStxBalance(account.address);
  const amount = valueFromBalance(accountStxBalance, 'stx');
  const stxPrice = useStxPriceValue();
  const valueInUsd = (+amount * stxPrice).toFixed(2);

  return (
    <TouchableOpacity
      onPress={handlePressAccount}
      style={[
        accountListItemStyles.container,
        {
          backgroundColor: colors.card,
          borderWidth: isSelected ? 1 : 0,
          borderColor: isSelected ? colors.confirm100 : undefined,
        },
      ]}>
      <AccountAvatar
        diameter={45}
        accountName={getAccountDisplayName(account)}
      />
      <View style={accountListItemStyles.accountDetails}>
        <View style={accountListItemStyles.accountNameWithAddress}>
          <Typography type="smallTitle">
            {getAccountDisplayName(account)}
          </Typography>
          <Typography
            type="commonText"
            style={[
              { color: colors.primary40 },
              accountListItemStyles.accountAddress,
            ]}>
            {`(${truncateAddress(account.address, 11)})`}
          </Typography>
          {isSelected && (
            <View style={accountListItemStyles.accountSelectedIconContainer}>
              <Check />
            </View>
          )}
        </View>
        <View>
          <Typography type="smallTitleR" style={{ color: colors.primary100 }}>
            {`$${valueInUsd}`}
          </Typography>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AccountListItem;
