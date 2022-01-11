import BigNumber from 'bignumber.js';
import { Tx } from '../models/transactions';
import { stacksValue } from './balanceUtils';
import {
  TransactionEventFungibleAsset,
  CoinbaseTransaction,
} from '@stacks/stacks-blockchain-api-types';
import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client';
import { truncateAddress } from './addressUtils';

const getAssetTransfer = (tx: Tx): TransactionEventFungibleAsset | null => {
  if (tx.tx_type !== 'contract_call') {
    return null;
  }
  if (tx.tx_status !== 'success') {
    return null;
  }
  const transfer = tx.events.find(
    event => event.event_type === 'fungible_token_asset',
  );
  if (transfer?.event_type !== 'fungible_token_asset') {
    return null;
  }
  return transfer;
};

export const getTxValue = (
  tx: Tx,
  isOriginator: boolean,
): number | string | null => {
  if (tx.tx_type === 'token_transfer') {
    return `${isOriginator ? '-' : ''}${stacksValue({
      value: tx.token_transfer.amount,
      withTicker: false,
    })}`;
  }
  const transfer = getAssetTransfer(tx);
  if (transfer) {
    return new BigNumber(transfer.asset.amount).toFormat();
  }
  return null;
};

const getContractName = (value: string) => {
  if (value.includes('.')) {
    const parts = value == null ? [] : value.split('.');
    if (parts) {
      if (value.includes('::')) {
        return parts[1].split('::')[0];
      }
      return parts[1];
    }
  }
  console.warn(
    'getContractName: does not contain a period, does not appear to be a contract_id.',
    {
      value: value,
    },
  );
  return value;
};

export const getTxTitle = (tx: Tx) => {
  switch (tx.tx_type) {
    case 'token_transfer':
      return 'Stacks Token';
    case 'contract_call':
      return tx.contract_call.function_name;
    case 'smart_contract':
      return getContractName(tx.smart_contract.contract_id);
    case 'coinbase':
      return `Coinbase ${(tx as CoinbaseTransaction).block_height}`;
    case 'poison_microblock':
      return 'Poison Microblock';
  }
};

export const txHasTime = (tx: Tx) => {
  return !!(
    ('burn_block_time_iso' in tx && tx.burn_block_time_iso) ||
    ('parent_burn_block_time_iso' in tx && tx.parent_burn_block_time_iso)
  );
};

export const getTxCaption = (transaction: Tx) => {
  switch (transaction.tx_type) {
    case 'smart_contract':
      return truncateAddress(transaction.smart_contract.contract_id, 11);
    case 'contract_call':
      return transaction.contract_call.contract_id.split('.')[1];
    case 'token_transfer':
    case 'coinbase':
    case 'poison_microblock':
      return truncateAddress(transaction.tx_id, 11);
    default:
      return null;
  }
};

export function isAddressTransactionWithTransfers(
  transaction: AddressTransactionWithTransfers | Tx,
): transaction is AddressTransactionWithTransfers {
  return 'tx' in transaction;
}

export const statusFromTx = (tx: Tx) => {
  if (tx?.tx_status === 'pending') {
    return 'pending';
  }
  if (tx?.tx_status === 'success') {
    return 'is_unanchored' in tx && tx.is_unanchored
      ? 'success_microblock'
      : 'success_anchor_block';
  }
  return 'failed';
};
