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
import { truncateAddress } from '../../../shared/addressUtils';
import { useAssets } from '../../../hooks/useAssets/useAssets';

interface StxTransferItemProps {
  stxTransfer: StxTransfer;
  parentTx: AddressTransactionWithTransfers;
}

const StxTransferItem = ({ stxTransfer, parentTx }: StxTransferItemProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { selectedAccountState } = useAccounts();
  const title = 'Stacks Token';
  const caption =
    getTxCaption(parentTx.tx, selectedAccountState?.address) ?? '';
  const isOriginator = stxTransfer.sender === selectedAccountState?.address;
  const { currentNetwork } = useNetwork();
  const link = `https://explorer.stacks.co/txid/${parentTx.tx.tx_id}?chain=${currentNetwork.name}`;

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
      tokenName={title}
      onClickTransaction={openTransactionInExplorer}
      caption={caption}
      value={value}
      isOriginator={isOriginator}
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
  return await tokenApi.getContractFtMetadata({
    contractId,
  });
};

export const calculateTokenTransferAmount = (
  decimals: number,
  amount: number | string | BigNumber,
) => {
  return new BigNumber(amount).shiftedBy(-decimals);
};

const FtTransferItem = ({ ftTransfer, parentTx }: FtTransferItemProps) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { selectedAccountState } = useAccounts();
  const { fungibleTokensApi } = useAtomValue(apiClientState);
  const { currentNetwork } = useNetwork();
  const [ftTitle, setFtTitle] = useState<string>('');
  const [ftValue, setFtValue] = useState<BigNumber>();
  const { selectedAccountAssets: assets } = useAssets();

  const link = `https://explorer.stacks.co/txid/${parentTx.tx.tx_id}?chain=${currentNetwork.name}`;

  const openTransactionInExplorer = () => {
    Linking.openURL(link);
  };

  const getFtDisplayAmount = async () => {
    const assetMetaData = await getAssetMeta(
      ftTransfer.asset_identifier,
      fungibleTokensApi,
    );
    const title = `${assetMetaData?.name || 'Token'} Transfer`;
    setFtTitle(title);
    const displayAmount = calculateTokenTransferAmount(
      assetMetaData.decimals,
      ftTransfer.amount,
    );
    setFtValue(displayAmount);
  };

  useEffect(() => {
    getFtDisplayAmount();
  }, []);
  const isTransaction =
    (ftTransfer.sender || '').match('^[A-Z0-9]{40,}$') &&
    (ftTransfer.recipient || '').match('^[A-Z0-9]{40,}$');
  const caption = isTransaction
    ? truncateAddress(
        ftTransfer.sender === selectedAccountState?.address
          ? ftTransfer.recipient
          : ftTransfer.sender,
        11,
      )
    : getTxCaption(parentTx.tx as any);
  const isOriginator = ftTransfer.sender === selectedAccountState?.address;
  const customURL = isTransaction
    ? assets.find(asset => asset.fullContractId === ftTransfer.asset_identifier)
        ?.metaData?.image_uri
    : undefined;

  if (typeof ftValue === 'undefined') {
    return null;
  }
  const value = `${isOriginator ? '-' : ''}${ftValue.toFormat()}`;

  return (
    <TransactionItem
      onClickTransaction={openTransactionInExplorer}
      title={ftTitle}
      caption={caption || ''}
      tokenName={ftTitle}
      value={value}
      isOriginator={isOriginator}
      customIcon={Stx}
      customURL={customURL}
      customStyle={{ backgroundColor: colors.primary100 }}
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

export default withSuspense(AccountTransaction);
