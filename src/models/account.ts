import { Account } from '@stacks/wallet-sdk/dist';

export type AccountWithAddress = Account & { address: string };
