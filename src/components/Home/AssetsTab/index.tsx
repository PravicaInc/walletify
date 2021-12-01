import React, { useCallback, useContext } from 'react';
import {
  Alert,
  FlatList,
  ListRenderItem,
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

const AssetsTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { selectedAccountState } = useAccounts();

  const handleCopyAccountAddress = () => {
    if (selectedAccountState) {
      Clipboard.setString(selectedAccountState.address);
      Alert.alert('Copied');
    }
  };

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

  const renderAsset: ListRenderItem<any> = useCallback(() => {
    return <AccountAsset />;
  }, []);

  return (
    <FlatList
      data={[]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderAsset}
      style={assetsTabStyles.assetsList}
      contentContainerStyle={assetsTabStyles.assetsListContent}
      ListEmptyComponent={EmptyAsset}
    />
  );
};

export default AssetsTab;
