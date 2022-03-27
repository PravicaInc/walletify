import React, { useContext, useEffect, useState } from 'react';
import {
  AddressTransactionWithTransfers,
  TokensApi,
} from '@stacks/blockchain-api-client';
import { FtTransfer, StxTransfer, Tx } from '../../../models/transactions';
import {
  getTxCaption,
  isAddressTransactionWithTransfers,
} from '../../../shared/transactionUtils';
import { StxTransferTransaction, TransactionItem } from './StxTransfer';
import { getAssetStringParts, stacksValue } from '../../../shared/balanceUtils';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import { useAtomValue } from 'jotai/utils';
import BigNumber from 'bignumber.js';
import { withSuspense } from '../../shared/WithSuspense';
import { apiClientState } from '../../../hooks/apiClients/apiClients';
import useNetwork from '../../../hooks/useNetwork/useNetwork';
import Stx from '../../../assets/images/stx.svg';
import { Linking } from 'react-native';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { toLower } from 'lodash';

interface StxTransferItemProps {
  stxTransfer: StxTransfer;
  parentTx: AddressTransactionWithTransfers;
}

const StxTransferItem = ({ stxTransfer, parentTx }: StxTransferItemProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { selectedAccountState } = useAccounts();
  const title = 'STX Transfer';
  const tx = parentTx.tx as Tx;
  const caption = getTxCaption(tx) ?? '';
  const isOriginator = stxTransfer.sender === selectedAccountState?.address;
  const { currentNetwork } = useNetwork();
  const link = `https://explorer.stacks.co/txid/${tx.tx_id}?chain=${currentNetwork.name}`;

  const openTransactionInExplorer = () => {
    Linking.openURL(link);
  };

  const value = `${isOriginator ? '-' : ''}${stacksValue({
    value: stxTransfer.amount,
    withTicker: false,
  })}`;

  return (
    <TransactionItem
      title={title}
      onClickTransaction={openTransactionInExplorer}
      caption={caption}
      value={value}
      isOriginator={isOriginator}
      tokenName="STX"
      customIcon={Stx}
      customStyle={{ backgroundColor: colors.primary100 }}
    />
  );
};

interface FtTransferItemProps {
  ftTransfer: FtTransfer;
  parentTx: AddressTransactionWithTransfers;
}

const getAssetMeta = async (identifier: string, tokenApi: TokensApi) => {
  const { contractName, address } = getAssetStringParts(identifier);
  const contractId = `${address}.${contractName}`;
  const assetMeta = await tokenApi.getContractFtMetadata({
    contractId,
  });
  return assetMeta;
};

export const calculateTokenTransferAmount = (
  decimals: number,
  amount: number | string | BigNumber,
) => {
  return new BigNumber(amount).shiftedBy(-decimals);
};

const FtTransferItem = ({ ftTransfer, parentTx }: FtTransferItemProps) => {
  const { selectedAccountState } = useAccounts();
  const { fungibleTokensApi } = useAtomValue(apiClientState);
  const { currentNetwork } = useNetwork();
  const [assetMetadata, setAssetMetadata] = useState<any>('');

  const tx = parentTx.tx as Tx;

  const link = `https://explorer.stacks.co/txid/${tx.tx_id}?chain=${currentNetwork.name}`;

  const openTransactionInExplorer = () => {
    Linking.openURL(link);
  };

  const ftTitle = `${assetMetadata?.name || 'Token'} Transfer`;
  const ftValue = assetMetadata
    ? calculateTokenTransferAmount(assetMetadata.decimals, ftTransfer.amount)
    : undefined;

  useEffect(() => {
    getAssetMeta(ftTransfer.asset_identifier, fungibleTokensApi).then(m =>
      setAssetMetadata(m),
    );
  }, [ftTransfer]);

  const caption = getTxCaption(tx) ?? '';
  const isOriginator = ftTransfer.sender === selectedAccountState?.address;

  if (typeof ftValue === 'undefined') {
    return null;
  }
  const value = `${isOriginator ? '-' : ''}${ftValue.toFormat()}`;

  return (
    <TransactionItem
      onClickTransaction={openTransactionInExplorer}
      title={ftTitle}
      caption={caption}
      value={value}
      isOriginator={isOriginator}
      tokenName={assetMetadata?.name}
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
  showFTTransfersOnly?: boolean;
  assetNameFilter?: string;
}

const AccountTransaction: React.FC<AccountTransactionProps> = ({
  transaction,
  showFTTransfersOnly,
  assetNameFilter,
}) => {
  if (!isAddressTransactionWithTransfers(transaction)) {
    if (showFTTransfersOnly && assetNameFilter !== 'STX') {
      return null;
    } else {
      return <StxTransferTransaction transaction={transaction} />;
    }
  } // This is a normal Transaction or MempoolTransaction

  const tx = transaction.tx as Tx;

  // Show transfer only for contract calls
  if (tx.tx_type !== 'contract_call') {
    if (showFTTransfersOnly && assetNameFilter !== 'STX') {
      return null;
    } else {
      return <StxTransferTransaction transaction={tx} />;
    }
  }

  if (showFTTransfersOnly) {
    if (assetNameFilter === 'STX') {
      transaction.ft_transfers = [];
    } else {
      transaction.stx_transfers = [];
      transaction.ft_transfers = transaction.ft_transfers?.filter(
        t => t.asset_identifier.split('::')[1] === toLower(assetNameFilter),
      );
    }
  }

  return (
    <>
      <TxTransfers transaction={transaction} />
      {!showFTTransfersOnly && <StxTransferTransaction transaction={tx} />}
    </>
  );
};

export default withSuspense(AccountTransaction);
