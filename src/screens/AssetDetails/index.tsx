import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { StackActions, useNavigation } from '@react-navigation/native';
import React, { useRef, useCallback, useContext } from 'react';
import {
  ImageBackground,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import SwitchAccountBottomSheet from '../../components/Accounts/SwitchAccountBottomSheet';
import Header from '../../components/shared/Header';
import HeaderBack from '../../components/shared/HeaderBack';
import SwitchAccountButton from '../../components/SwitchAccountButton';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import { styles } from './styles';
import Stx from '../../assets/images/stx.svg';
import UpArrow from '../../assets/images/upArrow.svg';
import DownArrow from '../../assets/images/downArrow.svg';
import { Typography } from '../../components/shared/Typography';
import AssetActivityList from '../../components/AssetActivityList';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { ThemeContext } from '../../contexts/Theme/theme';
import ReceiveBottomSheet from '../../components/ReceiveBottomSheet';
import { stxToMicroStx, valueFromBalance } from '../../shared/balanceUtils';
import { useStxPriceValue } from '../../hooks/useStxPrice/useStxPrice';
import { SafeAreaView } from 'react-native-safe-area-context';
import TokenAvatar from '../../components/Home/TokenAvatar';

type AssetDetailsProps = NativeStackScreenProps<
  RootStackParamList,
  'AssetDetails'
>;

const AssetDetails: React.FC<AssetDetailsProps> = ({
  route: {
    params: { asset },
  },
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { name, amount, contractAddress, contractName } = asset;
  const { switchAccount, walletAccounts } = useAccounts();
  const { dispatch } = useNavigation();
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const receiveRef = useRef<BottomSheetModal>(null);
  const stxPrice = useStxPriceValue();
  let value: any;
  if (name === 'STX') {
    value = valueFromBalance(
      stxToMicroStx(amount).multipliedBy(stxPrice),
      'stx',
      {
        fixedDecimals: false,
      },
    );
  }
  const handleGoBack = useCallback(() => dispatch(StackActions.pop()), []);

  const handlePressSwitchAccount = useCallback(() => {
    bottomSheetModalRef.current?.snapToIndex(
      (walletAccounts?.length || 0) > 5 ? 1 : 0,
    );
  }, [walletAccounts]);

  const handlePresentSend = useCallback(() => {
    dispatch(StackActions.push('sendForm', { asset }));
  }, []);

  const handlePresentReceive = useCallback(() => {
    receiveRef.current?.snapToIndex(0);
  }, []);

  const handleCancelSwitchAccount = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSwitchAccount = useCallback((accountIndex: number) => {
    switchAccount(accountIndex);
    handleCancelSwitchAccount();
  }, []);

  const renderTopPanel = () => {
    return (
      <>
        <Header
          containerStyles={styles.header}
          leftComponent={
            <HeaderBack
              text="Back"
              onPress={handleGoBack}
              hasChevron={true}
              chevronColor={colors.white}
              textColor={colors.white}
            />
          }
          rightComponent={
            <SwitchAccountButton
              mode="small"
              handlePressSwitchAccount={handlePressSwitchAccount}
            />
          }
        />
        <View style={styles.balanceContainer}>
          <Typography type="commonText" style={{ color: colors.white }}>
            {`Total ${name} Balance`}
          </Typography>
          <Typography
            type="hugeText"
            style={[styles.balanceText, { color: colors.white }]}>
            {`${amount}`}
          </Typography>
          <Typography
            type="commonText"
            style={[
              styles.balanceValueTitle,
              {
                opacity: value ? 1 : 0,
                color: colors.white,
              },
            ]}>
            Balance in USD
          </Typography>
          <Typography
            type="bigTitle"
            style={[
              styles.balanceText,
              { opacity: value ? 1 : 0, color: colors.white },
            ]}>
            {`$${value}`}
          </Typography>
        </View>
        {name === 'STX' ? (
          <Stx
            fill={'rgba(255,255,255,0.15)'}
            width={85}
            height={85}
            style={styles.stxIcon}
          />
        ) : (
          <TokenAvatar
            customStyle={{ ...styles.stxIcon, ...styles.tokenImage }}
            tokenName={asset.metaData?.symbol || ''}
            tokenURL={asset.metaData?.image_uri}
            showTokenSymbol
          />
        )}
        <View style={styles.balanceActionsContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePresentSend}
            style={[
              styles.balanceActionButton,
              styles.sendButton,
              {
                backgroundColor: colors.white,
              },
            ]}>
            <UpArrow fill={primaryColor} />
            <Typography
              type="buttonText"
              style={[styles.balanceActionButtonText, { color: primaryColor }]}>
              Send
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePresentReceive}
            style={[
              styles.balanceActionButton,
              {
                backgroundColor: colors.white,
              },
            ]}>
            <DownArrow fill={primaryColor} />
            <Typography
              type="buttonText"
              style={[styles.balanceActionButtonText, { color: primaryColor }]}>
              Receive
            </Typography>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const primaryColor = colors.primary100;
  const useGradient = name !== 'STX';

  return (
    <SafeAreaView
      edges={['bottom']}
      style={[styles.fill, { backgroundColor: colors.white }]}>
      {useGradient && (
        <ImageBackground
          source={require('../../assets/images/gradient.jpeg')}
          resizeMode={'cover'}
          imageStyle={styles.roundedBottomCorners}
          style={[
            styles.contentContainer,
            {
              backgroundColor: primaryColor,
            },
          ]}>
          {renderTopPanel()}
        </ImageBackground>
      )}
      {!useGradient && (
        <View
          style={[styles.contentContainer, { backgroundColor: primaryColor }]}>
          {renderTopPanel()}
        </View>
      )}
      <StatusBar barStyle={'light-content'} />
      <View style={styles.transactionsContainer}>
        <Typography style={styles.transactionsHeader} type="smallTitleR">
          Asset activity
        </Typography>
        <AssetActivityList
          listStyles={styles.list}
          isStx={asset.name === 'STX'}
          assetNameFilter={`${contractAddress}.${contractName}`}
        />
      </View>

      <SwitchAccountBottomSheet
        bottomSheetRef={bottomSheetModalRef}
        onSwitch={handleSwitchAccount}
        onCancel={handleCancelSwitchAccount}
      />
      <ReceiveBottomSheet ref={receiveRef} />
    </SafeAreaView>
  );
};

export default AssetDetails;
