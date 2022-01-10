import React, { useContext } from 'react';
import { View } from 'react-native';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { Tx } from '../../../models/transactions';
import {
  getTxCaption,
  getTxTitle,
  getTxValue,
} from '../../../shared/transactionUtils';
import { Typography } from '../../shared/Typography';
import TokenAvatar from '../TokenAvatar';
import Stx from '../../../assets/images/stx.svg';
import styles from './styles';
import InTransaction from '../../../assets/images/Home/inTransaction.svg';
import OutTransaction from '../../../assets/images/Home/outTransaction.svg';
import TransactionStatus from './TransactionStatus';

export const StxTransfer: React.FC<{
  transaction: Tx;
}> = ({ transaction }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { selectedAccountState } = useAccounts();
  const isOriginator =
    transaction.sender_address === selectedAccountState?.address;
  const value = getTxValue(transaction, isOriginator);
  if (!transaction) {
    return null;
  }
  return (
    <View
      key={transaction.tx_id}
      style={[
        styles.transactionCard,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <View style={styles.tokenIconContainer}>
        <TokenAvatar
          CustomIcon={<Stx />}
          tokenName="STX"
          customStyle={{ backgroundColor: colors.primary100 }}
        />
        <View style={styles.transactionIndicator}>
          {isOriginator ? <OutTransaction /> : <InTransaction />}
        </View>
      </View>
      <View style={styles.transactionInformationContainer}>
        <Typography style={{ color: colors.primary100 }} type="smallTitleR">
          {getTxTitle(transaction) === 'Stacks Token'
            ? 'STX Transfer'
            : getTxTitle(transaction)}
        </Typography>
        <Typography
          style={{ color: colors.primary40, marginTop: 7 }}
          type="commonText">
          {getTxCaption(transaction)}
        </Typography>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}>
        {value ? (
          <Typography style={{ color: colors.primary100 }} type="smallTitleR">
            {value}
          </Typography>
        ) : (
          <View />
        )}
        <View style={{ marginTop: 7, alignSelf: 'flex-end' }}>
          <TransactionStatus status={transaction.tx_status} />
        </View>
      </View>
    </View>
  );
};
