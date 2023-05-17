import React, { Suspense, useCallback, useContext } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import ContentLoader from 'react-content-loader/native';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import Header from '../../shared/Header';
import HeaderBack from '../../shared/HeaderBack';
import { ListRenderItem } from 'react-native';
import AccountListItem from '../AccountListItem';
import { AccountWithAddress } from '../../../models/account';
import { FlatList } from 'react-native-gesture-handler';
import styles from './styles';
import { withSuspense } from '../../shared/WithSuspense';
import { CustomBackdrop } from '../../shared/customBackdrop';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SwitchAccountBottomSheetProps {
  bottomSheetRef: React.Ref<BottomSheet>;
  onCancel: () => void;
  onSwitch: (accountIndex: number) => void;
}

const maxLength = 5;
const itemHeight = 95;

const SwitchAccountBottomSheet: React.FC<
  SwitchAccountBottomSheetProps
> = props => {
  const { bottom } = useSafeAreaInsets();
  const { bottomSheetRef, onCancel, onSwitch } = props;
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { walletAccounts, selectedAccountIndexState } = useAccounts();
  const canScroll = (walletAccounts?.length || 0) > 5;
  const snapPoints = React.useMemo(
    () => [itemHeight * maxLength + bottom, '90%'],
    [],
  );

  const renderAccount: ListRenderItem<AccountWithAddress> = useCallback(
    ({ item }) => {
      return (
        <Suspense fallback={<ContentLoader />}>
          <AccountListItem
            account={item}
            onPressAccount={() => onSwitch(item.index)}
            isSelected={item.index === selectedAccountIndexState}
            key={item.address}
          />
        </Suspense>
      );
    },
    [selectedAccountIndexState, onSwitch],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      index={-1}
      style={{ backgroundColor: colors.white }}
      backgroundStyle={{ backgroundColor: colors.white }}
      handleComponent={null}
      backdropComponent={CustomBackdrop}
      enablePanDownToClose>
      <Header
        containerStyles={styles.headerContainer}
        title="Switch Account"
        titleColor={colors.text}
        leftComponent={
          <HeaderBack
            text="Cancel"
            onPress={onCancel}
            hasChevron={false}
            textColor={colors.secondary100}
          />
        }
      />
      <FlatList
        data={walletAccounts}
        keyExtractor={account => account.address}
        scrollEnabled={canScroll}
        renderItem={renderAccount}
        contentContainerStyle={styles.accountsList}
      />
    </BottomSheet>
  );
};

export default withSuspense(SwitchAccountBottomSheet);
