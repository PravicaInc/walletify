import React, { useCallback, useContext, useMemo } from 'react';
import { View, TouchableOpacity, TouchableHighlight } from 'react-native';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { Typography } from '../../shared/Typography';
import Check from '../../../assets/images/check.svg';
import AccountAvatar from '../../shared/AccountAvatar';
import { AccountWithAddress } from '../../../models/account';
import styles from './styles';
import { truncateAddress } from '../../../shared/addressUtils';
import { useAccountAvailableStxBalance } from '../../../hooks/useAccounts/useAccounts';
import { valueFromBalance } from '../../../shared/balanceUtils';
import { useStxPriceValue } from '../../../hooks/useStxPrice/useStxPrice';
import BigNumber from 'bignumber.js';
import { withSuspense } from '../../shared/WithSuspense';
import Add from '../../../assets/images/add.svg';
import { StackActions, useNavigation } from '@react-navigation/native';

interface AccountProps {
  account: AccountWithAddress;
  onPressAccount: () => void;
  isSelected: boolean;
  disabled?: boolean;
}

const AccountListItem: React.FC<AccountProps> = props => {
  const { account, onPressAccount, isSelected, disabled } = props;
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { dispatch } = useNavigation();
  const accountStxBalance = useAccountAvailableStxBalance(account.address);
  const stxPrice = useStxPriceValue();
  const valueInUsd = useMemo(
    () =>
      valueFromBalance(
        (accountStxBalance as BigNumber).multipliedBy(stxPrice),
        'stx',
      ),
    [accountStxBalance, stxPrice],
  );
  const disabledStyle = { opacity: disabled ? 0.6 : 1 };
  const handleGoToCreate = useCallback(() => {
    dispatch(StackActions.push('CreateIdentity', { selectedAccount: account }));
  }, [account]);
  return (
    <TouchableHighlight
      underlayColor={colors.primary10}
      onPress={onPressAccount}
      disabled={disabled}
      style={[
        styles.container,
        {
          backgroundColor: colors.cardsColor,
          borderWidth: isSelected ? 1 : 0,
          borderColor: isSelected ? colors.confirm100 : undefined,
        },
      ]}>
      <>
        <AccountAvatar
          customStyle={disabledStyle}
          diameter={45}
          accountName={account.username || `Account ${account.index + 1}`}
        />
        <View style={[styles.accountNameWithAddress, disabledStyle]}>
          <Typography type="smallTitle" style={{color:colors.white}} numberOfLines={1} ellipsizeMode="tail">
            {account.username || `Account ${account.index + 1}`}
          </Typography>
          <Typography type="smallTitleR" style={{color:colors.activeState}}>
            {`$${valueInUsd}`}
          </Typography>
        </View>
        <View style={styles.accountDetails}>
          <Typography
            type="commonText"
            style={[
              { color: colors.textColor },
              styles.accountAddress,
              disabledStyle,
            ]}>
            {`(${truncateAddress(account.address, 11)})`}
          </Typography>
          {isSelected && <Check />}
          {disabled && (
            <TouchableOpacity
              onPress={handleGoToCreate}
              activeOpacity={0.6}
              style={styles.button}>
              <Add />
              <Typography
                type={'buttonText'}
                style={[styles.buttonText, { color: colors.secondary100 }]}>
                Create Identity
              </Typography>
            </TouchableOpacity>
          )}
        </View>
      </>
    </TouchableHighlight>
  );
};

export default withSuspense(AccountListItem);
