import React, { useCallback, useContext } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
  View,
} from 'react-native';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
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
  const { selectedAccountAssets: assets } = useAssets();

  const handleCopyAccountAddress = () => {
    if (account) {
      Clipboard.setString(account.address);
      Alert.alert('Copied');
    }
  };

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

  if (account === undefined && assets?.length === 0) {
    return (
      <ContentLoader
        style={{ alignSelf: 'center', marginTop: 20 }}
        speed={2}
        width={250}
        height={220}
        viewBox="0 0 250 220"
        backgroundColor={colors.darkgray}
        foregroundColor={colors.white}>
        <Rect x="48" y="8" rx="3" ry="3" width="200" height="6" />
        <Rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
        <Circle cx="20" cy="20" r="20" />
        <Rect x="48" y="68" rx="3" ry="3" width="200" height="6" />
        <Rect x="48" y="86" rx="3" ry="3" width="52" height="6" />
        <Circle cx="20" cy="80" r="20" />
        <Rect x="48" y="128" rx="3" ry="3" width="200" height="6" />
        <Rect x="48" y="146" rx="3" ry="3" width="52" height="6" />
        <Circle cx="20" cy="140" r="20" />
        <Rect x="48" y="188" rx="3" ry="3" width="200" height="6" />
        <Rect x="48" y="206" rx="3" ry="3" width="52" height="6" />
        <Circle cx="20" cy="200" r="20" />
      </ContentLoader>
    );
  }

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
