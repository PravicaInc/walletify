import React from 'react';
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
import { useContext } from 'react';
import { ThemeContext } from '../../contexts/Theme/theme';
import StxTokenIcon from '../../assets/images/stx.svg';
import {
  FungibleTokensApi,
  NonFungibleTokensApi,
} from '@stacks/blockchain-api-client';
import {
  currentAccountAvailableStxBalanceState,
  currentAccountBalancesUnanchoredState,
} from '../useAccounts/accountsStore';

export const assets = atom(async get => {
  const mapAssetResponseToToken = async (
    assets: { [x: string]: FungibleResponse | NonFungibleResponse },
    tokensApi?: FungibleTokensApi | NonFungibleTokensApi,
    isFungible = false,
  ) => {
    return Promise.all(
      Object.keys(assets).map(async fungibleKey => {
        const assetToken = assets[fungibleKey] as FungibleResponse &
          NonFungibleResponse;
        const { contractName, assetName, address } =
          getAssetStringParts(fungibleKey);
        const amount = assetToken.balance || assetToken.count;
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
        return Promise.resolve({
          name: isFungible ? assetName.toUpperCase() : assetName,
          amount: calculatedAmount,
          contractName,
          contractAddress: address,
          isFungible,
          metaData: localAsset,
        });
      }),
    );
  };
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
    const stxToken: AccountToken = {
      name: 'STX',
      defaultStyles: {
        backgroundColor: 'black',
      },
      icon: <StxTokenIcon />,
      amount: valueFromBalance(stxBalance as BigNumber, 'stx'),
    };
    results.push(stxToken);
  }
  if (fungibleResponse !== undefined) {
    const fungibleTokens: AccountToken[] = await mapAssetResponseToToken(
      fungibleResponse,
      fungibleTokensApi,
      true,
    );
    results.concat(...fungibleTokens);
  }
  if (nonFungibleResponse !== undefined) {
    const nonFungibleTokens: AccountToken[] = await mapAssetResponseToToken(
      nonFungibleResponse,
      nonFungibleTokensApi,
    );
    results.concat(...nonFungibleTokens);
  }
  return results;
});
