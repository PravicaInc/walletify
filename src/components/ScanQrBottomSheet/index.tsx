import React, { useCallback, useContext, useMemo } from 'react';
import { View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop } from '../shared/customBackdrop';
import styles from './styles';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { ThemeContext } from '../../contexts/Theme/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCodeScanner from 'react-native-qrcode-scanner';

type Props = {
  setRecipient: React.Dispatch<React.SetStateAction<string>>;
};

const ScanQrBottomSheet = React.forwardRef<any, Props>(
  ({ setRecipient }, ref) => {
    const snapPoints = useMemo(() => ['99%'], []);
    console.log('qqqqqqq');

    const {
      theme: { colors },
    } = useContext(ThemeContext);

    const handleGoBack = useCallback(() => {
      ref.current?.close();
    }, []);

    const onSuccess = e => {
      setRecipient(e.data);
      ref.current?.close();
    };

    return (
      <Portal>
        <BottomSheet
          snapPoints={snapPoints}
          ref={ref}
          index={-1}
          handleComponent={null}
          enablePanDownToClose
          backdropComponent={CustomBackdrop}>
          <SafeAreaView
            style={[styles.container, { backgroundColor: colors.white }]}>
            <View>
              <View>
                <Header
                  leftComponent={
                    <HeaderBack
                      onPress={handleGoBack}
                      text="Cancel"
                      textColor={colors.secondary100}
                    />
                  }
                />
              </View>
              <View>
                <QRCodeScanner
                  onRead={onSuccess}
                  // topContent={
                  //   <Text style={styles.centerText}>
                  //     Go to{' '}
                  //     <Text style={styles.textBold}>
                  //       wikipedia.org/wiki/QR_code
                  //     </Text>{' '}
                  //     on your computer and scan the QR code.
                  //   </Text>
                  // }
                  // bottomContent={
                  //   <TouchableOpacity style={styles.buttonTouchable}>
                  //     <Text style={styles.buttonText}>OK. Got it!</Text>
                  //   </TouchableOpacity>
                  // }
                />
              </View>
              <View></View>
            </View>
          </SafeAreaView>
        </BottomSheet>
      </Portal>
    );
  },
);

export default ScanQrBottomSheet;
