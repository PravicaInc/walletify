import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import { AccountToken } from '../../../models/account';
import { withSuspense } from '../../shared/WithSuspense';
import { useAssets } from '../../../hooks/useAssets/useAssets';

const AssetsTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { selectedAccountState: account } = useAccounts();
  const { selectedAccountAssets } = useAssets();
  const [assets, setAssets] = useState<AccountToken[]>([]);

  const handleCopyAccountAddress = () => {
    if (account) {
      Clipboard.setString(account.address);
      Alert.alert('Copied');
    }
  };

  useEffect(() => {
    if (
      selectedAccountAssets !== undefined &&
      selectedAccountAssets.length > 0
    ) {
      setAssets(selectedAccountAssets);
    }
  }, [selectedAccountAssets]);

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
  }, [account]);

  const renderAsset: ListRenderItem<AccountToken> = useCallback(({ item }) => {
    return <AccountAsset item={item} />;
  }, []);

  return (
    <FlatList
      data={assets}
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
