import { useQuery } from 'react-query';
import { FeeEstimation } from '../../shared/types';
import BigNumber from 'bignumber.js';

const GITHUB_PRIMARY_BRANCH = 'main';
export const GITHUB_ORG = 'hirosystems';
export const GITHUB_REPO = 'stacks-wallet-web';
const githubWalletConfigRawUrl = `https://raw.githubusercontent.com/${GITHUB_ORG}/${GITHUB_REPO}/${GITHUB_PRIMARY_BRANCH}/config/wallet-config.json`;

interface FeeEstimationsConfig {
  maxValues?: number[];
  maxValuesEnabled?: boolean;
  minValues?: number[];
  minValuesEnabled?: boolean;
}
interface ActiveFiatProviderType {
  name: string;
  enabled: boolean;
}

interface HiroConfig {
  messages: any;
  activeFiatProviders?: Record<string, ActiveFiatProviderType>;
  feeEstimationsMinMax?: FeeEstimationsConfig;
}

async function fetchHiroMessages(): Promise<HiroConfig> {
  return fetch(githubWalletConfigRawUrl).then(msg => msg.json());
}
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}
function useRemoteHiroConfig() {
  const { data } = useQuery(['walletConfig'], fetchHiroMessages, {
    // As we're fetching from Github, a third-party, we want
    // to avoid any unnecessary stress on their services, so
    // we use quite slow stale/retry times
    staleTime: 1000 * 60 * 10,
    retryDelay: 1000 * 60,
  });
  return data;
}
export function useConfigFeeEstimationsMaxEnabled() {
  const config = useRemoteHiroConfig();
  if (isUndefined(config) || isUndefined(config?.feeEstimationsMinMax)) {
    return;
  }
  return config.feeEstimationsMinMax.maxValuesEnabled;
}
export function useConfigFeeEstimationsMaxValues() {
  const config = useRemoteHiroConfig();
  if (typeof config?.feeEstimationsMinMax === 'undefined') {
    return;
  }
  if (!config.feeEstimationsMinMax.maxValues) {
    return;
  }
  if (!Array.isArray(config.feeEstimationsMinMax.maxValues)) {
    return;
  }
  return config.feeEstimationsMinMax.maxValues;
}
export function useConfigFeeEstimationsMinEnabled() {
  const config = useRemoteHiroConfig();
  if (isUndefined(config) || isUndefined(config?.feeEstimationsMinMax)) {
    return;
  }
  return config.feeEstimationsMinMax.minValuesEnabled;
}

export function useConfigFeeEstimationsMinValues() {
  const config = useRemoteHiroConfig();
  if (typeof config?.feeEstimationsMinMax === 'undefined') {
    return;
  }
  if (!config.feeEstimationsMinMax.minValues) {
    return;
  }
  if (!Array.isArray(config.feeEstimationsMinMax.minValues)) {
    return;
  }
  return config.feeEstimationsMinMax.minValues;
}

const defaultFeeEstimationsMaxValues = [500000, 750000, 2000000];
const defaultFeeEstimationsMinValues = [2500, 3000, 3500];

export function useFeeEstimationsMaxValues() {
  // Get it first from the config
  const configFeeEstimationsMaxEnabled = useConfigFeeEstimationsMaxEnabled();
  const configFeeEstimationsMaxValues = useConfigFeeEstimationsMaxValues();
  // Only when the remote config file explicitly sets the maxValuesEnabled as false, we return no max cap for fees
  if (configFeeEstimationsMaxEnabled === false) {
    return;
  }
  return configFeeEstimationsMaxValues || defaultFeeEstimationsMaxValues;
}

export function useFeeEstimationsMinValues() {
  // Get it first from the config
  const configFeeEstimationsMinEnabled = useConfigFeeEstimationsMinEnabled();
  const configFeeEstimationsMinValues = useConfigFeeEstimationsMinValues();
  // Only when the remote config file explicitly sets the minValuesEnabled as false, we return no min cap for fees
  if (configFeeEstimationsMinEnabled === false) {
    return;
  }
  return configFeeEstimationsMinValues || defaultFeeEstimationsMinValues;
}

export function getFeeEstimationsWithCappedValues(
  feeEstimations: FeeEstimation[],
  feeEstimationsMaxValues: number[] | undefined,
  feeEstimationsMinValues: number[] | undefined,
) {
  return feeEstimations.map((feeEstimation, index) => {
    if (
      feeEstimationsMaxValues &&
      new BigNumber(feeEstimation.fee).isGreaterThan(
        feeEstimationsMaxValues[index],
      )
    ) {
      return { fee: feeEstimationsMaxValues[index], fee_rate: 0 };
    } else if (
      feeEstimationsMinValues &&
      new BigNumber(feeEstimation.fee).isLessThan(
        feeEstimationsMinValues[index],
      )
    ) {
      return { fee: feeEstimationsMinValues[index], fee_rate: 0 };
    } else {
      return feeEstimation;
    }
  });
}
