import React, { useContext } from 'react';
import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client';
import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import { View } from 'react-native';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { Tx } from '../../../models/transactions';
import { getTxTitle, getTxValue } from '../../../shared/transactionUtils';
import TokenAvatar from '../TokenAvatar';
import Stx from '../../../assets/images/stx.svg';
import styles from './styles';

interface AccountTransactionProps {
  transaction: AddressTransactionWithTransfers | MempoolTransaction;
}

const AccountTransaction: React.FC<AccountTransactionProps> = props => {
  const { tx } = props.transaction;
  const { selectedAccountState } = useAccounts();
  const transaction: Tx = tx;
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const isOriginator =
    transaction.sender_address === selectedAccountState?.address;

  const value = getTxValue(transaction, isOriginator);

  return (
    <View
      key={transaction.tx_id}
      style={[
        styles.transactionCard,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <View style={styles.transactionInformationContainer}>
        <TokenAvatar
          CustomIcon={<Stx />}
          tokenName="STX"
          customStyle={{ backgroundColor: colors.primary100 }}
        />
        <Typography style={{ color: colors.primary100 }} type="smallTitleR">
          {getTxTitle(transaction)}
        </Typography>
      </View>
      {value && (
        <Typography style={{ color: colors.primary100 }} type="midTitle">
          {value}
        </Typography>
      )}
    </View>
  );
};

export default AccountTransaction;
