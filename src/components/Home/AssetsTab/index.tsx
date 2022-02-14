import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  View,
} from 'react-native';
import ContentLoader from 'react-content-loader/native';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import AccountAsset from '../AccountAsset';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import NoAssets from '../../../assets/images/Home/noAssets.svg';
import Copy from '../../../assets/images/copy.svg';
import Clipboard from '@react-native-clipboard/clipboard';
import styles from './styles';
import { AccountToken } from '../../../models/account';
import { withSuspense } from '../../shared/WithSuspense';
import { useAssets } from '../../../hooks/useAssets/useAssets';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AssetsTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { bottom } = useSafeAreaInsets();
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
    } else {
      setAssets([]);
    }
  }, [selectedAccountAssets]);

  const EmptyAsset = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <NoAssets />
        <Typography
          type="commonText"
          style={[styles.emptyMessage, { color: colors.primary40 }]}>
          No Assets Yet
        </Typography>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={handleCopyAccountAddress}
          style={styles.copyAddressButton}>
          <Copy />
          <Typography
            type="commonText"
            style={[styles.copyAddressIcon, { color: colors.secondary100 }]}>
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
      style={[styles.assetsList, { marginBottom: bottom + 10 }]}
      contentContainerStyle={styles.assetsListContent}
      ListEmptyComponent={EmptyAsset}
    />
  );
};

export default withSuspense(AssetsTab, <ContentLoader />);
