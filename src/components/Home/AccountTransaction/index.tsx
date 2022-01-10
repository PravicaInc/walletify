import React from 'react';
import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client';
import { View } from 'react-native';
import { Tx } from '../../../models/transactions';
import { isAddressTransactionWithTransfers } from '../../../shared/transactionUtils';
import { StxTransfer } from './StxTransfer';

interface AccountTransactionProps {
  transaction: AddressTransactionWithTransfers | Tx;
}

const AccountTransaction: React.FC<AccountTransactionProps> = props => {
  const { transaction } = props;
  if (!isAddressTransactionWithTransfers(transaction)) {
    return <StxTransfer transaction={transaction} />;
  } // This is a normal Transaction or MempoolTransaction

  // Show transfer only for contract calls
  if (transaction.tx.tx_type !== 'contract_call') {
    return <StxTransfer transaction={transaction.tx} />;
  }
  return <View />;
};

export default AccountTransaction;
