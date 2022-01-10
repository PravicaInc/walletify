import React from 'react';
import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client';
import { View } from 'react-native';
import { FtTransfer, StxTransfer, Tx } from '../../../models/transactions';
import {
  getTxCaption,
  isAddressTransactionWithTransfers,
} from '../../../shared/transactionUtils';
import { StxTransferTransaction, TransactionItem } from './StxTransfer';
import { stacksValue } from '../../../shared/balanceUtils';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { Typography } from '../../shared/Typography';
import { useAtomValue } from 'jotai/utils';
import BigNumber from 'bignumber.js';
import { AssetWithMeta } from '../../../models/assets';
import { currentAccountBalancesUnanchoredState } from '../../../hooks/useAccounts/accountsStore';
import { withSuspense } from '../../shared/WithSuspense';

interface StxTransferItemProps {
  stxTransfer: StxTransfer;
  parentTx: AddressTransactionWithTransfers;
}

const StxTransferItem = ({ stxTransfer, parentTx }: StxTransferItemProps) => {
  const { selectedAccountState } = useAccounts();
  const title = 'Stacks Token Transfer';
  const caption = getTxCaption(parentTx.tx) ?? '';
  const isOriginator = stxTransfer.sender === selectedAccountState?.address;

  const value = `${isOriginator ? '-' : ''}${stacksValue({
    value: stxTransfer.amount,
    withTicker: false,
  })}`;

  return (
    <TransactionItem
      title={title}
      caption={caption}
      value={value}
      isOriginator={isOriginator}
    />
  );
};

interface FtTransferItemProps {
  ftTransfer: FtTransfer;
  parentTx: AddressTransactionWithTransfers;
}

export function useAssetByIdentifier(identifier: string) {
  console.log(identifier);
  return null;
}

export const calculateTokenTransferAmount = (
  asset: AssetWithMeta | undefined,
  amount: number | string | BigNumber,
) => {
  if (!asset || !asset.meta) {
    return;
  }
  return new BigNumber(amount).shiftedBy(-asset.meta.decimals);
};

const FtTransferItem = ({ ftTransfer, parentTx }: FtTransferItemProps) => {
  const { selectedAccountState } = useAccounts();
  const asset = useAssetByIdentifier(ftTransfer.asset_identifier);
  const title = `${asset?.meta?.name || 'Token'} Transfer`;
  const caption = getTxCaption(parentTx.tx) ?? '';
  const isOriginator = ftTransfer.sender === selectedAccountState?.address;

  const displayAmount = calculateTokenTransferAmount(asset, ftTransfer.amount);
  if (typeof displayAmount === 'undefined') {
    return null;
  }
  const value = `${isOriginator ? '-' : ''}${displayAmount.toFormat()}`;

  return (
    <TransactionItem
      title={title}
      caption={caption}
      value={value}
      isOriginator={isOriginator}
    />
  );
};

interface TxTransfersProps {
  transaction: AddressTransactionWithTransfers;
}

const TxTransfers = ({ transaction, ...rest }: TxTransfersProps) => {
  return (
    <>
      {transaction.stx_transfers.map((stxTransfer, index) => (
        <StxTransferItem
          stxTransfer={stxTransfer}
          parentTx={transaction}
          {...rest}
          key={index}
        />
      ))}
      {transaction.ft_transfers
        ? transaction.ft_transfers.map((ftTransfer, index) => (
            <FtTransferItem
              ftTransfer={ftTransfer}
              parentTx={transaction}
              {...rest}
              key={index}
            />
          ))
        : null}
    </>
  );
};

interface AccountTransactionProps {
  transaction: AddressTransactionWithTransfers | Tx;
}

const AccountTransaction: React.FC<AccountTransactionProps> = props => {
  const { transaction } = props;
  if (!isAddressTransactionWithTransfers(transaction)) {
    return <StxTransferTransaction transaction={transaction} />;
  } // This is a normal Transaction or MempoolTransaction

  // Show transfer only for contract calls
  if (transaction.tx.tx_type !== 'contract_call') {
    return <StxTransferTransaction transaction={transaction.tx} />;
  }
  return (
    <>
      <TxTransfers transaction={transaction} />
      <StxTransferTransaction transaction={transaction.tx} />
    </>
  );
};

export default withSuspense(
  AccountTransaction,
  <Typography type="commonText">Loading</Typography>,
);
