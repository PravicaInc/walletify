import { AddressBalanceResponse } from '@stacks/blockchain-api-client';
import { Account } from '@stacks/wallet-sdk/dist';
import BigNumber from 'bignumber.js';

export type AccountWithAddress = Account & { address: string };

type SelectedKeys =
  | 'balance'
  | 'total_sent'
  | 'total_received'
  | 'total_fees_sent'
  | 'total_miner_rewards_received'
  | 'locked';

export type AccountBalanceStxKeys = keyof Pick<
  AddressBalanceResponse['stx'],
  SelectedKeys
>;

export const accountBalanceStxKeys: AccountBalanceStxKeys[] = [
  'balance',
  'total_sent',
  'total_received',
  'total_fees_sent',
  'total_miner_rewards_received',
  'locked',
];

export interface AccountStxBalanceBigNumber
  extends Omit<AddressBalanceResponse['stx'], AccountBalanceStxKeys> {
  balance: BigNumber;
  total_sent: BigNumber;
  total_received: BigNumber;
  total_fees_sent: BigNumber;
  total_miner_rewards_received: BigNumber;
  locked: BigNumber;
}

export interface AccountBalanceResponseBigNumber
  extends Omit<AddressBalanceResponse, 'stx'> {
  stx: AccountStxBalanceBigNumber;
}
