import React, { useCallback, useContext } from 'react';
import {
  ActivityIndicator,
  ListRenderItem,
  SectionList,
  View,
} from 'react-native';
import NoActivity from '../../../assets/images/Home/noActivity.svg';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import activityTabStyles from './styles';
import { useTransactions } from '../../../hooks/useTransactions/useTransactions';
import { AddressTransactionWithTransfers } from '@stacks/blockchain-api-client';
import type { MempoolTransaction } from '@stacks/stacks-blockchain-api-types';
import AccountTransaction from '../AccountTransaction';
import { isAddressTransactionWithTransfers } from '../../../shared/transactionUtils';
import {
  format,
  startOfDay,
  fromUnixTime,
  isYesterday,
  isToday,
} from 'date-fns';

const formatDate = (date: number) => {
  if (isToday(date)) {
    return 'Today';
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return format(date, 'MMMM dd, yyyy');
};

const ActivityTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const {
    accountTransactionsWithTransfers,
    mempoolTransactions,
    loading,
    isRefreshing,
    refreshTransactionsList,
  } = useTransactions();

  const EmptyActivity = useCallback(() => {
    return (
      <View style={activityTabStyles.emptyContainer}>
        <NoActivity />
        {loading ? (
          <ActivityIndicator color={colors.secondary100} />
        ) : (
          <Typography
            type="commonText"
            style={[
              activityTabStyles.emptyMessage,
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
    AddressTransactionWithTransfers | MempoolTransaction
  > = useCallback(({ item }) => {
    return <AccountTransaction transaction={item} />;
  }, []);

  const groupTxsByDateMap2 = (
    txs: (AddressTransactionWithTransfers | MempoolTransaction)[],
  ) => {
    return Object.values(
      txs.reduce((txsByDate, atx) => {
        const tx = isAddressTransactionWithTransfers(atx) ? atx.tx : atx;
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
          data: (MempoolTransaction | AddressTransactionWithTransfers)[];
        };
      },
    );
  };

  return (
    <SectionList
      sections={groupTxsByDateMap2([
        ...mempoolTransactions,
        ...accountTransactionsWithTransfers,
      ])}
      renderSectionHeader={info => (
        <Typography
          type="commonText"
          style={{ color: colors.primary40, paddingBottom: 10 }}>
          {formatDate(info.section.title)}
        </Typography>
      )}
      onRefresh={refreshTransactionsList}
      refreshing={isRefreshing}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderTransaction}
      style={activityTabStyles.activityList}
      contentContainerStyle={activityTabStyles.activityListContent}
      ListEmptyComponent={EmptyActivity}
      stickySectionHeadersEnabled={false}
    />
  );
};

export default ActivityTab;
