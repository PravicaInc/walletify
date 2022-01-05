import BigNumber from 'bignumber.js';
import { Tx } from '../models/transactions';
import { stacksValue } from './balanceUtils';
import {
  TransactionEventFungibleAsset,
  CoinbaseTransaction,
} from '@stacks/stacks-blockchain-api-types';

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
    var parts = value == null ? void 0 : value.split('.');

    if (value.includes('::')) {
      return parts[1].split('::')[0];
    }

    return parts[1];
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
