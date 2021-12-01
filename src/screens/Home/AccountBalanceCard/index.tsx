import React, { useContext } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import UpArrow from '../../../assets/images/upArrow.svg';
import DownArrow from '../../../assets/images/downArrow.svg';
import AccountBalanceCardStyles from './styles';
import BigNumber from 'bignumber.js';
import { valueFromBalance } from '../../../shared/balanceUtils';

interface AccountBalanceCardProps {
  balance: BigNumber;
  price: number;
}

const AccountBalanceCard: React.FC<AccountBalanceCardProps> = props => {
  const { balance, price } = props;
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const amount = valueFromBalance(balance, 'stx');
  const amountValue = (+amount * price).toFixed(2);

  return (
    <View
      style={[
        AccountBalanceCardStyles.container,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <Typography type="commonText" style={{ color: colors.primary40 }}>
        Your Account Balance:
      </Typography>
      <View style={AccountBalanceCardStyles.balanceContainer}>
        <Typography
          type="bigTitle"
          style={[
            AccountBalanceCardStyles.balance,
            { color: colors.primary100 },
          ]}>
          {`$${amountValue}`}
        </Typography>
        <Typography
          type="commonText"
          style={[
            AccountBalanceCardStyles.currency,
            { color: colors.primary40 },
          ]}>
          USD
        </Typography>
      </View>
      <View style={AccountBalanceCardStyles.balanceActionsContainer}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            AccountBalanceCardStyles.balanceActionButton,
            AccountBalanceCardStyles.sendButton,
            {
              backgroundColor: colors.primary100,
            },
          ]}>
          <UpArrow />
          <Typography
            type="buttonText"
            style={[
              AccountBalanceCardStyles.balanceActionButtonText,
              { color: colors.white },
            ]}>
            Send
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={[
            AccountBalanceCardStyles.balanceActionButton,
            {
              backgroundColor: colors.primary100,
            },
          ]}>
          <DownArrow />
          <Typography
            type="buttonText"
            style={[
              AccountBalanceCardStyles.balanceActionButtonText,
              { color: colors.white },
            ]}>
            Receive
          </Typography>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default AccountBalanceCard;
