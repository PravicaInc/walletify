import React, { RefObject, useCallback, useContext, useMemo } from 'react';
import { Alert, Clipboard, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import QRCode from 'react-native-qrcode-svg';
import { CustomBackdrop } from '../shared/customBackdrop';
import styles from './styles';
import { ThemeContext } from '../../contexts/Theme/theme';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import WarningIcon from '../shared/WarningIcon';
import { Typography } from '../shared/Typography';
import { truncateAddress } from '../../shared/addressUtils';
import Copy from '../../assets/images/copy.svg';

type Props = {};

const ReceiveBottomSheet = React.forwardRef<any, Props>(({}, ref) => {
  const { selectedAccountState: account } = useAccounts();

  const snapPoints = useMemo(() => ['92%'], []);

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const dismissBottomSheet = useCallback(() => {
    (ref as RefObject<BottomSheetModal>)?.current?.close();
  }, []);

  const handleCopyAccountAddress = () => {
    if (account) {
      Clipboard.setString(account.address);
      Alert.alert('Copied');
    }
  };

  const truncatedAddress = truncateAddress(account?.address, 11);

  return (
    <Portal>
      <BottomSheet
        snapPoints={snapPoints}
        ref={ref}
        index={-1}
        handleComponent={null}
        style={{ backgroundColor: colors.white }}
        backgroundStyle={{ backgroundColor: colors.white }}
        enablePanDownToClose
        backdropComponent={CustomBackdrop}>
        <View style={styles.container}>
          <Header
            containerStyles={styles.headerContainer}
            title="Receive"
            titleColor={colors.text}
            leftComponent={
              <HeaderBack
                textColor={colors.secondary100}
                text="Cancel"
                onPress={dismissBottomSheet}
              />
            }
          />
          <View
            style={
              (styles.horizontalFill,
              styles.centerItems,
              styles.warningContainer)
            }>
            <WarningIcon
              width={20}
              height={20}
              style={styles.alignCenter}
              fill={colors.primary100}
            />
            <Typography
              type="commonText"
              style={{
                color: colors.primary60,
                ...styles.warningText,
              }}>
              If your sender is physically near you let them scan this QR code
              or simply share your account's unique address to receive STX.
            </Typography>
          </View>
          <View style={styles.qrCodeContainer}>
            <QRCode size={237} value={account?.address} />
          </View>
          <View style={(styles.horizontalFill, styles.centerItems)}>
            <Typography type="midTitle">
              {account && account.username}
            </Typography>
            <View style={styles.accountInfoContainer}>
              <Typography
                type="smallTitleR"
                style={{
                  color: colors.primary40,
                }}>{`(${truncatedAddress})`}</Typography>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleCopyAccountAddress}
                style={styles.copyAddressButton}>
                <Copy fill={colors.primary100} />
                <Typography
                  type="commonText"
                  style={[
                    styles.copyAddressIcon,
                    { color: colors.secondary100 },
                  ]}>
                  Copy Address
                </Typography>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>
    </Portal>
  );
});

export default ReceiveBottomSheet;
