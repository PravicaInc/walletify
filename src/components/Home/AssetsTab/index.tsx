import React, { useCallback, useContext } from 'react';
import { Alert, ScrollView, TouchableOpacity, View } from 'react-native';
import ContentLoader, { Circle, Rect } from 'react-content-loader/native';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import AccountAsset from '../LargeAccountAsset';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import NoAssets from '../../../assets/images/Home/noAssets.svg';
import Copy from '../../../assets/images/copy.svg';
import Clipboard from '@react-native-clipboard/clipboard';
import styles from './styles';
import { useAssets } from '../../../hooks/useAssets/useAssets';
import { withSuspense } from '../../shared/WithSuspense';
import { AccountToken } from '../../../models/account';

const AssetsTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
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

  const renderGroup = (group: AccountToken[]) => {
    return group.map((a, idx) => {
      if (group.length % 2 !== 0 && idx === group.length - 1) {
        return <AccountAsset key={idx} item={a} style={styles.lastAsset} />;
      } else {
        return <AccountAsset key={idx} item={a} />;
      }
    });
  };

  const renderedAssets = useCallback(() => {
    const coins = assets.filter(a => a.isFungible);
    const collectibles = assets.filter(a => !a.isFungible);

    let children = [];

    if (coins.length > 0) {
      children.push(
        <Typography
          style={[styles.assetGroupHeader, { color: colors.primary40 }]}
          type="smallTitleR">
          Coins
        </Typography>,
      );
      children.push(
        <View style={styles.assetsList}>{renderGroup(coins)}</View>,
      );
    }

    if (collectibles.length > 0) {
      children.push(
        <Typography
          style={[styles.assetGroupHeader, { color: colors.primary40 }]}
          type="smallTitleR">
          Collectibles
        </Typography>,
      );
      children.push(
        <View style={styles.assetsList}>{renderGroup(collectibles)}</View>,
      );
    }

    return children;
  }, [assets]);

  if (account === undefined && assets?.length === 0) {
    return (
      <ContentLoader
        style={styles.contentLoader}
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
  } else if (assets === undefined || assets.length === 0) {
    return EmptyAsset();
  }

  return <ScrollView>{renderedAssets()}</ScrollView>;
};

export default withSuspense(AssetsTab, <ContentLoader />);
