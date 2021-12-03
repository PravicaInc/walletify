import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import AccountAsset from '../AccountAsset';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import NoAssets from '../../../assets/images/Home/noAssets.svg';
import Copy from '../../../assets/images/copy.svg';
import Clipboard from '@react-native-clipboard/clipboard';
import assetsTabStyles from './styles';
import { useAtomValue } from 'jotai/utils';
import {
  currentAccountAvailableStxBalanceState,
  currentAccountBalancesUnanchoredState,
} from '../../../hooks/useAccounts/accountsStore';
import { getAssetStringParts } from '../../../shared/balanceUtils';
import {
  AccountToken,
  FungibleResponse,
  NonFungibleResponse,
} from '../../../models/account';
import { valueFromBalance } from '../../../shared/balanceUtils';
import { BigNumber } from 'bignumber.js';
import AsyncStorage from '@react-native-community/async-storage';
import { apiClientState } from '../../../hooks/apiClients/apiClients';
import { TokensApi } from '@stacks/blockchain-api-client';
import { FtMeta } from '../../../models/assets';
import Stx from '../../../assets/images/stx.svg';
import { withSuspense } from '../../shared/WithSuspense';

const mapAssetResponseToToken = async (
  assets: { [x: string]: FungibleResponse | NonFungibleResponse },
  tokensApi?: TokensApi,
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
        localAsset = await tokensApi.getContractFtMetadata({
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

const AssetsTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { selectedAccountState } = useAccounts();
  const [tokens, setTokens] = useState<AccountToken[]>([]);
  const balances = useAtomValue(currentAccountBalancesUnanchoredState);
  const stxBalance = useAtomValue(currentAccountAvailableStxBalanceState);
  const { tokensApi } = useAtomValue(apiClientState);

  const handleCopyAccountAddress = () => {
    if (selectedAccountState) {
      Clipboard.setString(selectedAccountState.address);
      Alert.alert('Copied');
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const fungibleResponse = balances?.fungible_tokens as {
        [x: string]: FungibleResponse;
      };
      const nonFungibleResponse = balances?.non_fungible_tokens as {
        [x: string]: NonFungibleResponse;
      };
      const stxToken: AccountToken = {
        name: 'STX',
        defaultStyles: {
          backgroundColor: colors.primary100,
        },
        icon: <Stx />,
        amount: valueFromBalance(stxBalance as BigNumber, 'stx'),
      };
      const fungibleTokens: AccountToken[] = await mapAssetResponseToToken(
        fungibleResponse,
        tokensApi,
        true,
      );
      const nonFungibleTokens: AccountToken[] = await mapAssetResponseToToken(
        nonFungibleResponse,
      );
      setTokens([stxToken, ...fungibleTokens, ...nonFungibleTokens]);
    };
    if (balances) {
      fetch();
    }
  }, [balances]);

  const EmptyAsset = useCallback(() => {
    return (
      <View style={assetsTabStyles.emptyContainer}>
        <NoAssets />
        <Typography
          type="commonText"
          style={[assetsTabStyles.emptyMessage, { color: colors.primary40 }]}>
          No Assets Yet
        </Typography>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleCopyAccountAddress}
          style={assetsTabStyles.copyAddressButton}>
          <Copy />
          <Typography
            type="commonText"
            style={[
              assetsTabStyles.copyAddressIcon,
              { color: colors.secondary100 },
            ]}>
            Copy Address
          </Typography>
        </TouchableOpacity>
      </View>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAccountState]);

  const renderAsset: ListRenderItem<AccountToken> = useCallback(({ item }) => {
    return <AccountAsset item={item} />;
  }, []);

  return (
    <FlatList
      data={tokens}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderAsset}
      style={assetsTabStyles.assetsList}
      contentContainerStyle={assetsTabStyles.assetsListContent}
      ListEmptyComponent={EmptyAsset}
    />
  );
};

export default withSuspense(AssetsTab, <Text>Loading</Text>);
