import React, { useCallback, useContext } from 'react';
import {
  ActivityIndicator,
  FlatList,
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
import { Tx } from '../../../models/transactions';
import { isAddressTransactionWithTransfers, txHasTime } from '../../../shared/transactionUtils';

const ActivityTab: React.FC = () => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { accountTransactionsWithTransfers, mempoolTransactions, loading } =
    useTransactions();

  // function groupTxsByDateMap(
  //   txs: (AddressTransactionWithTransfers | MempoolTransaction)[],
  // ) {
  //   return txs.reduce((txsByDate, atx) => {
  //     const tx = isAddressTransactionWithTransfers(atx) ? atx.tx : atx;
  //     const time =
  //       ('burn_block_time_iso' in tx && tx.burn_block_time_iso) ||
  //       ('parent_burn_block_time_iso' in tx && tx.parent_burn_block_time_iso);
  //     const date = time ? time.format('YYYY:MM:DD') : undefined;
  //     if (date && txHasTime(tx)) {
  //       if (!txsByDate.has(date)) {
  //         txsByDate.set(date, []);
  //       }
  //       txsByDate.set(date, [...(txsByDate.get(date) || []), atx]);
  //     }
  //     if (!txHasTime(tx)) {
  //       const today = new Date().toISOString().split('T')[0];
  //       txsByDate.set(today, [...(txsByDate.get(today) || []), atx]);
  //     }
  //     return txsByDate;
  //   }, new Map<string,(AddressTransactionWithTransfers | MempoolTransaction)[]>());
  // }

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

  return (
    <FlatList
      data={[...mempoolTransactions, ...accountTransactionsWithTransfers]}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      renderItem={renderTransaction}
      style={activityTabStyles.activityList}
      contentContainerStyle={activityTabStyles.activityListContent}
      ListEmptyComponent={EmptyActivity}
    />
  );
};

export default ActivityTab;
