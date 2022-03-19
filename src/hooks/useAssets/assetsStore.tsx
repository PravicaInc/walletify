import { atom } from 'jotai';
import BigNumber from 'bignumber.js';
import {
  AccountToken,
  FungibleResponse,
  NonFungibleResponse,
} from '../../models/account';
import { apiClientState } from '../apiClients/apiClients';
import {
  getAssetStringParts,
  valueFromBalance,
} from '../../shared/balanceUtils';
import { FtMeta } from '../../models/assets';
import AsyncStorage from '@react-native-community/async-storage';
import StxTokenIcon from '../../assets/images/stx.svg';
import {
  FungibleTokensApi,
  NonFungibleTokensApi,
} from '@stacks/blockchain-api-client';
import {
  currentAccountAvailableStxBalanceState,
  currentAccountBalancesUnanchoredState,
} from '../useAccounts/accountsStore';

import { currentStxPrice } from '../useStxPrice/stxPriceStore';

const mapAssetResponseToToken = async (
  assets: { [x: string]: FungibleResponse | NonFungibleResponse },
  tokensApi?: FungibleTokensApi | NonFungibleTokensApi,
  isFungible = false,
) => {
  return Promise.all(
    Object.keys(assets)
      .filter(fungibleKey => {
        const assetToken = assets[fungibleKey] as FungibleResponse &
          NonFungibleResponse;
        const amount = assetToken.balance || assetToken.count;
        return !new BigNumber(amount).isEqualTo(0);
      })
      .map(async fungibleKey => {
        const assetToken = assets[fungibleKey] as FungibleResponse &
          NonFungibleResponse;
        const amount = assetToken.balance || assetToken.count;
        const { contractName, assetName, address } =
          getAssetStringParts(fungibleKey);
        const contractId = `${address}.${contractName}`;

        let localAsset: FtMeta = isFungible
          ? JSON.parse((await AsyncStorage.getItem(contractId)) || '{}')
          : {};

        if (!localAsset.name && isFungible && tokensApi) {
          localAsset = await (
            tokensApi as FungibleTokensApi
          ).getContractFtMetadata({
            contractId,
          });
          await AsyncStorage.setItem(contractId, JSON.stringify(localAsset));
        }

        const calculatedAmount = valueFromBalance(
          amount,
          isFungible ? 'ft' : 'nft',
          localAsset,
        );

        return {
          name: isFungible ? assetName.toUpperCase() : assetName,
          amount: calculatedAmount,
          contractName,
          contractAddress: address,
          isFungible,
          metaData: localAsset,
        };
      }),
  );
};

export const assets = atom(async get => {
  const { fungibleTokensApi, nonFungibleTokensApi } = get(apiClientState);

  const fungibleResponse = get(currentAccountBalancesUnanchoredState)
    ?.fungible_tokens as {
    [x: string]: FungibleResponse;
  };
  const nonFungibleResponse = get(currentAccountBalancesUnanchoredState)
    ?.non_fungible_tokens as {
    [x: string]: NonFungibleResponse;
  };

  const stxBalance = get(currentAccountAvailableStxBalanceState);

  let results: AccountToken[] = [];
  if (stxBalance !== undefined) {
    const stxValue = valueFromBalance(
      stxBalance.multipliedBy(get(currentStxPrice)),
      'stx',
      {
        fixedDecimals: false,
      },
    );

    const stxToken: AccountToken = {
      name: 'STX',
      defaultStyles: {
        backgroundColor: 'black',
      },
      icon: StxTokenIcon,
      amount: valueFromBalance(stxBalance as BigNumber, 'stx'),
      value: `~$${stxValue}`,
      isFungible: true,
    };

    if (new BigNumber(0).isLessThan(stxBalance)) {
      results.push(stxToken);
    }
  }
  if (fungibleResponse !== undefined) {
    const fungibleTokens: AccountToken[] = await mapAssetResponseToToken(
      fungibleResponse,
      fungibleTokensApi,
      true,
    );
    results = [...results, ...fungibleTokens];
  }
  if (nonFungibleResponse !== undefined) {
    const nonFungibleTokens: AccountToken[] = await mapAssetResponseToToken(
      nonFungibleResponse,
      nonFungibleTokensApi,
    );
    results = [...results, ...nonFungibleTokens];
  }

  return results;
});
