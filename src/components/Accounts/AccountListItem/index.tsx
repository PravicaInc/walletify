import React, { useCallback, useContext, useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
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
import BigNumber from 'bignumber.js';
import { withSuspense } from '../../shared/WithSuspense';

interface AccountProps {
  account: AccountWithAddress;
  onPressAccount: () => void;
  isSelected: boolean;
}

const AccountListItem: React.FC<AccountProps> = props => {
  const { account, onPressAccount, isSelected } = props;
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const accountStxBalance = useAccountAvailableStxBalance(account.address);
  const stxPrice = useStxPriceValue();
  const amount = useMemo(
    () => valueFromBalance(accountStxBalance as BigNumber, 'stx'),
    [accountStxBalance],
  );
  const valueInUsd = useMemo(
    () => (+amount * stxPrice).toFixed(2),
    [stxPrice, amount],
  );

  const cardStyles = useCallback(() => {
    return {
      backgroundColor: colors.card,
      borderWidth: isSelected ? 1 : 0,
      borderColor: isSelected ? colors.confirm100 : undefined,
    };
  }, [isSelected]);

  return (
    <TouchableOpacity
      onPress={onPressAccount}
      style={[accountListItemStyles.container, cardStyles()]}>
      <AccountAvatar
        diameter={45}
        accountName={account.username || `Account ${account.index + 1}`}
      />
      <View style={accountListItemStyles.accountNameWithAddress}>
        <Typography type="smallTitle" numberOfLines={1} ellipsizeMode="tail">
          {account.username || `Account ${account.index + 1}`}
        </Typography>
        <Typography type="smallTitleR" style={{ color: colors.primary100 }}>
          {`$${valueInUsd}`}
        </Typography>
      </View>
      <View style={accountListItemStyles.accountDetails}>
        <Typography
          type="commonText"
          style={[
            { color: colors.primary40 },
            accountListItemStyles.accountAddress,
          ]}>
          {`(${truncateAddress(account.address, 11)})`}
        </Typography>
        {isSelected && <Check />}
      </View>
    </TouchableOpacity>
  );
};

export default withSuspense(AccountListItem);
