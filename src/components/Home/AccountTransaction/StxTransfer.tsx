import React, { useContext } from 'react';
import { Linking, View } from 'react-native';
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
import FunctionCall from '../../../assets/images/Home/functionCall.svg';
import TransactionStatus from './TransactionStatus';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useNetwork from '../../../hooks/useNetwork/useNetwork';

export const StxTransferTransaction: React.FC<{
  transaction: Tx;
}> = ({ transaction }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { selectedAccountState } = useAccounts();
  const isOriginator =
    transaction.sender_address === selectedAccountState?.address;
  const value = getTxValue(transaction, isOriginator);
  const { currentNetwork } = useNetwork();
  if (!transaction) {
    return null;
  }

  const renderTransactionTypeIcon = () => {
    if (transaction.tx_type === 'contract_call') {
      return <FunctionCall />;
    } else {
      if (isOriginator) {
        return <OutTransaction />;
      } else {
        return <InTransaction />;
      }
    }
  };

  const link = `https://explorer.stacks.co/txid/${transaction.tx_id}?chain=${currentNetwork.name}`;

  const openTransactionInExplorer = () => {
    Linking.openURL(link);
  };
  return (
    <TouchableOpacity
      onPress={openTransactionInExplorer}
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
          {renderTransactionTypeIcon()}
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
          <TransactionStatus transaction={transaction} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const TransactionItem: React.FC<{
  title: string;
  caption: string;
  value: string;
  isOriginator: boolean;
  onClickTransaction: () => void;
}> = ({ title, caption, value, isOriginator, onClickTransaction }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      onPress={onClickTransaction}
      activeOpacity={0.9}
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
        <Typography
          style={{ color: colors.primary100 }}
          type="smallTitleR"
          numberOfLines={1}
          ellipsizeMode="tail">
          {title === 'Stacks Token' ? 'Stx Transfer' : title}
        </Typography>
        <Typography
          style={{ color: colors.primary40, marginTop: 7 }}
          type="commonText">
          {caption}
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
          <TransactionStatus
            transaction={{
              tx_status: 'success',
              anchor_mode: 'on_chain_only',
              is_unanchored: false,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
