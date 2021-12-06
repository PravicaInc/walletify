import React, { Suspense, useCallback, useContext } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { useAccounts } from '../../../hooks/useAccounts/useAccounts';
import Header from '../../shared/Header';
import HeaderBack from '../../shared/HeaderBack';
import { ListRenderItem, Text, View } from 'react-native';
import AccountListItem from '../AccountListItem';
import { AccountWithAddress } from '../../../models/account';
import { FlatList } from 'react-native-gesture-handler';
import switchAccountBottomSheetStyles from './styles';
import { withSuspense } from '../../shared/WithSuspense';
import { CustomBackdrop } from '../../shared/customBackdrop';

interface SwitchAccountBottomSheetProps {
  bottomSheetRef: React.Ref<BottomSheet>;
  onCancel: () => void;
  onSwitch: (accountIndex: number) => void;
}

const SwitchAccountBottomSheet: React.FC<SwitchAccountBottomSheetProps> =
  props => {
    const snapPoints = React.useMemo(() => ['60%', '90%'], []);
    const { bottomSheetRef, onCancel, onSwitch } = props;
    const {
      theme: { colors },
    } = useContext(ThemeContext);
    const { walletAccounts, selectedAccountIndexState } = useAccounts();

    const renderAccount: ListRenderItem<AccountWithAddress> = useCallback(
      ({ item }) => {
        return (
          <Suspense fallback={<Text>Loading</Text>}>
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
        backdropComponent={CustomBackdrop}
        enablePanDownToClose>
        <View style={switchAccountBottomSheetStyles.contentContainer}>
          <Header
            title="Switch Account"
            titleColor={colors.primary100}
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
            renderItem={renderAccount}
            contentContainerStyle={switchAccountBottomSheetStyles.accountsList}
          />
        </View>
      </BottomSheet>
    );
  };

export default withSuspense(SwitchAccountBottomSheet, <Text>Loading</Text>);
