import React, {
  RefObject,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { StatusBar, View } from 'react-native';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop } from '../shared/customBackdrop';
import styles from './styles';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { ThemeContext } from '../../contexts/Theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { Typography } from '../shared/Typography';

type Props = {
  setRecipient: React.Dispatch<React.SetStateAction<string>>;
};

const ScanQrBottomSheet = React.forwardRef<any, Props>(
  ({ setRecipient }, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const snapPoints = useMemo(() => ['99.99%'], []);

    const {
      theme: { colors },
    } = useContext(ThemeContext);

    const handleGoBack = useCallback(() => {
      (ref as RefObject<BottomSheet>)?.current?.close();
    }, []);

    const onSuccess = (e: { data: string }) => {
      setRecipient(e.data);
      (ref as RefObject<BottomSheet>)?.current?.close();
    };

    const handleSheetChanges = useCallback((index: number) => {
      if (index === 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }, []);

    return (
      <Portal>
        <BottomSheet
          snapPoints={snapPoints}
          ref={ref}
          index={-1}
          handleComponent={null}
          enablePanDownToClose
          backdropComponent={CustomBackdrop}
          onChange={handleSheetChanges}>
          <SafeAreaView style={styles.container}>
            <SafeAreaView style={styles.headerContainer}>
              {isOpen && <StatusBar barStyle={'light-content'} />}
              <Header
                title="Scan Recipient QR Code"
                titleColor={colors.white}
                leftComponent={
                  <HeaderBack
                    onPress={handleGoBack}
                    text="Cancel"
                    textColor={colors.secondary100}
                  />
                }
              />
            </SafeAreaView>
            <View style={styles.itemsContainer}>
              <View style={styles.scanner}>
                {isOpen && (
                  <QRCodeScanner
                    cameraStyle={{ height: '100%' }}
                    showMarker={true}
                    onRead={onSuccess}
                  />
                )}
              </View>
              <View style={styles.footer}>
                <Typography type="commonText" style={{ color: colors.white }}>
                  If you and your recipient are physically near each other,
                  let’s try to scan their QR code from their Receive screen.
                </Typography>
              </View>
            </View>
          </SafeAreaView>
        </BottomSheet>
      </Portal>
    );
  },
);

export default ScanQrBottomSheet;
