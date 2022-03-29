import React, { useCallback, useContext, useRef } from 'react';
import {
  FlatList,
  ListRenderItem,
  TouchableHighlight,
  View,
} from 'react-native';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { AccountToken } from '../../../models/account';
import TokenAvatar from '../TokenAvatar';
import styles from './styles';
import ChevronIcon from '../../../assets/images/chevronDown.svg';
import BottomSheet from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CustomBackdrop } from '../../shared/customBackdrop';
import Header from '../../shared/Header';
import HeaderBack from '../../shared/HeaderBack';
import { useAssets } from '../../../hooks/useAssets/useAssets';
import { Portal } from '@gorhom/portal';
import Check from '../../../assets/images/check.svg';

interface AccountAssetProps {
  selectedAsset: AccountToken;
  setSelectedAsset: (value: AccountToken) => void;
  resetForm: () => void;
}

const AssetPicker: React.FC<AccountAssetProps> = props => {
  const { icon, name, amount, defaultStyles, metaData } = props.selectedAsset;
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const { selectedAccountAssets: assets } = useAssets();
  const handlePressSwitchAccount = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex((assets?.length || 0) > 5 ? 1 : 0);
  }, [assets]);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const selectedName = name === 'STX' ? 'Stacks Coins' : name;
  return (
    <>
      <AssetsPickerBottomSheet
        bottomSheetRef={bottomSheetModalRef}
        selectedAsset={props.selectedAsset}
        setSelectedAsset={props.setSelectedAsset}
        resetForm={props.resetForm}
      />
      <TouchableHighlight
        underlayColor={colors.primary10}
        onPress={handlePressSwitchAccount}
        key={name}
        style={[
          styles.tokenCard,
          {
            backgroundColor: colors.card,
          },
        ]}>
        <>
          <View style={styles.tokenInformationContainer}>
            <TokenAvatar
              CustomIcon={icon}
              customStyle={defaultStyles}
              tokenName={name}
              tokenURL={metaData?.image_uri}
            />
            <View>
              <Typography
                style={[styles.textSpace, { color: colors.primary100 }]}
                type="smallTitleR">
                {selectedName}
              </Typography>
              <Typography
                style={[styles.textSpace, { color: colors.primary40 }]}
                searchWords={[amount]}
                highlightStyle={{ color: colors.primary100 }}
                type="commonText">
                {`Avilable Balance: ${amount}`}
              </Typography>
            </View>
          </View>
          <ChevronIcon />
        </>
      </TouchableHighlight>
    </>
  );
};

export default AssetPicker;

interface AssetsPickerBottomSheetProps {
  bottomSheetRef: React.Ref<BottomSheet>;
  selectedAsset: AccountToken;
  setSelectedAsset: (value: AccountToken) => void;
  resetForm: () => void;
}

const maxLength = 5;
const itemHeight = 85;

const AssetsPickerBottomSheet: React.FC<AssetsPickerBottomSheetProps> = ({
  bottomSheetRef,
  setSelectedAsset,
  selectedAsset,
  resetForm,
}) => {
  const { bottom } = useSafeAreaInsets();
  const { selectedAccountAssets: assets } = useAssets();
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const canScroll = (assets?.length || 0) > 5;
  const snapPoints = React.useMemo(
    () => [itemHeight * maxLength + bottom, '90%'],
    [],
  );
  const handlePressAsset = useCallback(
    (item: AccountToken) => () => {
      resetForm();
      setSelectedAsset(item);
      bottomSheetRef?.current?.close();
    },
    [],
  );
  const renderAsset: ListRenderItem<AccountToken> = useCallback(
    ({ item }) => {
      const selectedName = item.name === 'STX' ? 'Stacks Coins' : item.name;
      const isSelected = item.name === selectedAsset.name;
      return (
        <TouchableHighlight
          underlayColor={colors.primary10}
          onPress={handlePressAsset(item)}
          style={[
            styles.asset,
            {
              backgroundColor: colors.card,
            },
            isSelected
              ? {
                  borderColor: colors.confirm100,
                  borderWidth: 1,
                }
              : {},
          ]}>
          <>
            <View style={styles.tokenInformationContainer}>
              <TokenAvatar
                CustomIcon={item.icon}
                customStyle={item.defaultStyles}
                tokenName={item.name}
                tokenURL={item?.metaData?.image_uri}
              />
              <View>
                <Typography
                  style={[styles.textSpace, { color: colors.primary100 }]}
                  type="smallTitleR">
                  {selectedName}
                </Typography>
                <Typography
                  style={[styles.textSpace, { color: colors.primary40 }]}
                  searchWords={[item.amount]}
                  highlightStyle={{ color: colors.primary100 }}
                  type="commonText">
                  {`Avilable Balance: ${item.amount}`}
                </Typography>
              </View>
            </View>
            {isSelected && <Check />}
          </>
        </TouchableHighlight>
      );
    },
    [selectedAsset],
  );
  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        handleComponent={null}
        backdropComponent={CustomBackdrop}
        enablePanDownToClose>
        <Header
          containerStyles={styles.headerContainer}
          title="Select Asset"
          titleColor={colors.primary100}
          leftComponent={
            <HeaderBack
              text="Cancel"
              onPress={bottomSheetRef?.current?.close}
              hasChevron={false}
              textColor={colors.secondary100}
            />
          }
        />
        <FlatList
          data={assets.filter(asset => !!asset?.isFungible)}
          keyExtractor={asset => asset.name}
          scrollEnabled={canScroll}
          renderItem={renderAsset}
          contentContainerStyle={styles.assetsList}
        />
      </BottomSheet>
    </Portal>
  );
};
