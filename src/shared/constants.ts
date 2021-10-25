import { Language } from '../stores/LocalizationStore/types';

export const LANGUAGES = [new Language('en', 'English', false)] as const;
export const DEFAULT_TESTNET_SERVER =
  'https://stacks-node-api.testnet.stacks.co';

export const DEFAULT_MAINNET_SERVER = 'https://stacks-node-api.stacks.co';

export const DEFAULT_NETWORK = 'mainnet';
