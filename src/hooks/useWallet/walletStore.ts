import { atom } from 'jotai';
import { Wallet } from '@stacks/wallet-sdk/dist';

export const wallet = atom<Wallet | undefined>(undefined);
