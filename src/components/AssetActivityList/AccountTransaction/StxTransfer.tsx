import React, { useContext } from 'react';
import { Linking, View, ViewStyle } from 'react-native';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { Tx } from '../../../models/transactions';
import {
  getTxCaption,
  getTxTitle,
  getTxValue,
} from '../../../shared/transactionUtils';
import { Typography } from '../../shared/Typography';
import TokenAvatar from '../../Home/TokenAvatar';
import Stx from '../../../assets/images/stx.svg';
import styles from './styles';
import InTransaction from '../../../assets/images/Home/inTransaction.svg';
import OutTransaction from '../../../assets/images/Home/outTransaction.svg';
import FunctionCall from '../../../assets/images/Home/functionCall.svg';
import TransactionStatus from './TransactionStatus';
import { TouchableOpacity } from 'react-native-gesture-handler';
import useNetwork from '../../../hooks/useNetwork/useNetwork';
import { CoinbaseTransaction } from '@stacks/stacks-blockchain-api-types';

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
    if (transaction.tx_type !== 'contract_call') {
      if (isOriginator) {
        return <OutTransaction width={24} height={24} />;
      } else {
        return <InTransaction width={24} height={24} />;
      }
    }
  };

  const link = `https://explorer.stacks.co/txid/${transaction.tx_id}?chain=${currentNetwork.name}`;

  const openTransactionInExplorer = () => {
    Linking.openURL(link);
  };
  const tokenName = () => {
    switch (transaction.tx_type) {
      case 'coinbase':
        return `Coinbase ${(transaction as CoinbaseTransaction).block_height}`;
      case 'smart_contract':
        return transaction.smart_contract.contract_id;
      case 'contract_call':
        return `${transaction.contract_call.contract_id}::${transaction.contract_call.function_name}`;
      case 'token_transfer':
        return 'STX';
      case 'poison_microblock':
        return 'Failed';
      default:
        return '';
    }
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
          CustomIcon={
            transaction.tx_type === 'token_transfer' ? Stx : undefined
          }
          tokenName={tokenName()}
          customStyle={
            transaction.tx_type === 'token_transfer'
              ? { backgroundColor: colors.primary100 }
              : {}
          }
        />
        <View style={styles.transactionIndicator}>
          {renderTransactionTypeIcon()}
        </View>
      </View>
      <View style={styles.transactionInformationContainer}>
        <Typography
          numberOfLines={1}
          ellipsizeMode="tail"
          style={{ color: colors.primary100 }}
          type="smallTitleR">
          {getTxTitle(transaction)}
        </Typography>
        <Typography
          style={{ color: colors.primary40, marginTop: 10 }}
          type="commonText">
          {getTxCaption(transaction, selectedAccountState?.address)}
        </Typography>
      </View>
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginLeft: 'auto',
        }}>
        {value ? (
          <Typography style={{ color: colors.primary100 }} type="smallTitleR">
            {value}
          </Typography>
        ) : (
          <View />
        )}
        {transaction.tx_type === 'contract_call' && (
          <FunctionCall width={13} height={17} />
        )}
        <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
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
  tokenName?: string;
  customIcon?: any;
  customStyle?: ViewStyle;
}> = ({
  title,
  caption,
  value,
  isOriginator,
  onClickTransaction,
  tokenName,
  customIcon,
  customStyle,
}) => {
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
          CustomIcon={customIcon}
          tokenName={tokenName ?? ''}
          customStyle={customStyle}
        />
        <View style={styles.transactionIndicator}>
          {isOriginator ? (
            <OutTransaction width={24} height={24} />
          ) : (
            <InTransaction width={24} height={24} />
          )}
        </View>
      </View>
      <View style={styles.transactionInformationContainer}>
        <Typography
          style={{ color: colors.primary100 }}
          type="smallTitleR"
          numberOfLines={1}
          ellipsizeMode="tail">
          {title}
        </Typography>
        <Typography
          style={{ color: colors.primary40, marginTop: 10 }}
          type="commonText">
          {caption}
        </Typography>
      </View>
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginLeft: 'auto',
        }}>
        {value ? (
          <Typography style={{ color: colors.primary100 }} type="smallTitleR">
            {value}
          </Typography>
        ) : (
          <View />
        )}
        <View style={{ marginTop: 10, alignSelf: 'flex-end' }}>
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
