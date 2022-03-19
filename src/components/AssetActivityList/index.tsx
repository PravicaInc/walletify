import React, { useCallback, useContext } from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  SectionList,
  View,
} from 'react-native';
import NoActivity from '../../assets/images/noActivity.svg';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/Theme/theme';
import styles from './styles';
import { useTransactions } from '../../hooks/useTransactions/useTransactions';
import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client';
import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import AccountTransaction from './AccountTransaction';
import { isAddressTransactionWithTransfers } from '../../shared/transactionUtils';
import {
  format,
  startOfDay,
  fromUnixTime,
  isYesterday,
  isToday,
} from 'date-fns';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SubmittedTransaction } from '../../models/transactions';

const formatDate = (date: number) => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMMM dd, yyyy');
};

type AssetActivityListProps = {
  showFTTransfersOnly?: boolean;
  assetNameFilter?: string;
};

const AssetActivityList: React.FC<AssetActivityListProps> = ({
  showFTTransfersOnly,
  assetNameFilter,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const {
    accountTransactionsWithTransfers,
    mempoolTransactions,
    submittedTransactions,
    loading,
    isRefreshing,
    refreshTransactionsList,
  } = useTransactions();
  const { bottom } = useSafeAreaInsets();

  const EmptyActivity = useCallback(() => {
    return (
      <View style={styles.emptyContainer}>
        <NoActivity />
        {loading ? (
          <ActivityIndicator color={colors.secondary100} />
        ) : (
          <Typography
            type="commonText"
            style={[
              styles.emptyMessage,
              {
                color: colors.primary40,
              },
            ]}>
            No Activity Yet
          </Typography>
        )}
      </View>
    );
  }, []);

  const renderTransaction: ListRenderItem<
    SubmittedTransaction | AddressTransactionWithTransfers | MempoolTransaction
  > = useCallback(({ item }) => {
    return (
      <AccountTransaction
        transaction={item}
        showFTTransfersOnly={showFTTransfersOnly}
        assetNameFilter={assetNameFilter}
      />
    );
  }, []);

  const groupTxsByDateMap2 = (
    txs: (
      | SubmittedTransaction
      | AddressTransactionWithTransfers
      | MempoolTransaction
    )[],
  ) => {
    return Object.values(
      txs.reduce((txsByDate: any, atx) => {
        const tx: any = isAddressTransactionWithTransfers(atx) ? atx.tx : atx;
        const date: number = startOfDay(
          ('burn_block_time' in tx &&
            tx.burn_block_time > 0 &&
            fromUnixTime(tx.burn_block_time)) ||
            ('parent_burn_block_time' in tx &&
              fromUnixTime(tx.parent_burn_block_time)) ||
            Date.now(),
        ).getTime();
        return {
          ...txsByDate,
          [date]: {
            title: date,
            data: [...(txsByDate[date]?.data || []), atx],
          },
        };
      }, {}) as {
        [x: number]: {
          title: number;
          data: (
            | SubmittedTransaction
            | MempoolTransaction
            | AddressTransactionWithTransfers
          )[];
        };
      },
    );
  };

  const getTransactions = (): (
    | SubmittedTransaction
    | AddressTransactionWithTransfers
    | MempoolTransaction
  )[] => {
    const txs = [
      ...submittedTransactions,
      ...mempoolTransactions,
      ...accountTransactionsWithTransfers,
    ];

    if (showFTTransfersOnly) {
      const results = [
        ...accountTransactionsWithTransfers.filter(
          t => t.stx_transfers.length > 0 || (t.ft_transfers?.length ?? 0) > 0,
        ),
      ];

      if (assetNameFilter === 'STX') {
        return [...mempoolTransactions, ...results];
      } else {
        return results;
      }
    } else {
      return txs;
    }
  };

  return (
    <SectionList
      sections={groupTxsByDateMap2(getTransactions())}
      renderSectionHeader={info => (
        <Typography
          type="commonText"
          style={[{ color: colors.primary40 }, styles.sectionHeader]}>
          {formatDate(info.section.title)}
        </Typography>
      )}
      onRefresh={refreshTransactionsList}
      refreshing={isRefreshing}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderTransaction}
      style={[styles.activityList, { marginBottom: bottom + 10 }]}
      contentContainerStyle={styles.activityListContent}
      ListEmptyComponent={EmptyActivity}
      stickySectionHeadersEnabled={false}
    />
  );
};

export default AssetActivityList;
