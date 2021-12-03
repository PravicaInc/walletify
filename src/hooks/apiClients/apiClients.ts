import {
  Configuration,
  AccountsApi,
  TokensApi,
  BNSApi,
  FaucetsApi,
  TransactionsApi,
  FeesApi,
  Middleware,
  RequestContext,
  AddressBalanceResponse,
} from '@stacks/blockchain-api-client';
import { atom } from 'jotai';
import { atomFamilyWithQuery } from 'jotai-query-toolkit';
import {
  AccountClientKeys,
  PrincipalWithNetworkUrl,
  QueryRefreshRates,
} from '../../models/apiClient';
import { MICROBLOCKS_ENABLED } from '../../shared/constants';
import { selectedNetwork } from '../useNetwork/networkStore';

const apiClients = (config: Configuration) => {
  const accountsApi = new AccountsApi(config);
  const transactionsApi = new TransactionsApi(config);
  const faucetsApi = new FaucetsApi(config);
  const bnsApi = new BNSApi(config);
  const feesApi = new FeesApi(config);
  const tokensApi = new TokensApi(config);

  return {
    accountsApi,
    transactionsApi,
    faucetsApi,
    bnsApi,
    feesApi,
    tokensApi,
  };
};

const unanchoredMiddleware: Middleware = {
  pre: (context: RequestContext) => {
    const url = new URL(context.url);
    if (!url.toString().includes('/v2')) {
      url.searchParams.set('unanchored', 'true');
    }
    return Promise.resolve({
      init: context.init,
      url: url.toString(),
    });
  },
};

function createConfig(basePath: string, anchored?: boolean) {
  const middleware: Middleware[] = [];
  if (MICROBLOCKS_ENABLED && !anchored) {
    middleware.push(unanchoredMiddleware);
  }
  return new Configuration({
    basePath,
    fetchApi: fetch,
    middleware,
  });
}

export const apiClientState = atom(get => {
  const network = get(selectedNetwork);
  const config = createConfig(network.url);
  return apiClients(config);
});

export const apiClientAnchoredState = atom(get => {
  const network = get(selectedNetwork);
  const config = createConfig(network.url, true);
  return apiClients(config);
});

export const accountBalancesAnchoredClient = atomFamilyWithQuery<
  PrincipalWithNetworkUrl,
  AddressBalanceResponse
>(
  AccountClientKeys.AnchoredBalancesClient,
  async function accountBalancesClientQueryFn(get, { principal }) {
    const { accountsApi } = get(apiClientAnchoredState); // using the anchored client
    return (await accountsApi.getAccountBalance({
      principal,
    })) as AddressBalanceResponse;
  },
  {
    keepPreviousData: false,
    refetchInterval: QueryRefreshRates.MEDIUM,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  },
);

export const accountBalancesUnanchoredClient = atomFamilyWithQuery<
  PrincipalWithNetworkUrl,
  AddressBalanceResponse
>(
  AccountClientKeys.BalancesClient,
  async function accountBalancesClientQueryFn(get, { principal }) {
    const { accountsApi } = get(apiClientState);
    return (await accountsApi.getAccountBalance({
      principal,
    })) as AddressBalanceResponse;
  },
  {
    keepPreviousData: false,
    refetchInterval: QueryRefreshRates.MEDIUM,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  },
);
