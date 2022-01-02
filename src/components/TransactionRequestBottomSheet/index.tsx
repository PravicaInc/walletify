import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Image, Text, View } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { Typography } from '../shared/Typography';
import authenticationBottomSheetStyles from './styles';
import { useAtomValue } from 'jotai/utils';
import { withSuspense } from '../shared/WithSuspense';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop } from '../shared/customBackdrop';
import { transactionRequestTokenPayloadState } from '../../hooks/transactions/requests';
import { useTransactionRequest } from '../../hooks/transactions/useTransactionRequest';
import { STXTransferPayload } from '@stacks/connect';

const TransactionRequestBottomSheet: React.FC = () => {
  const snapPoints = React.useMemo(() => ['90%'], []);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const transactionRequest = useAtomValue(transactionRequestTokenPayloadState);
  const setTransactionRequest = useTransactionRequest();
  const bottomSheetRef = useRef<BottomSheet>(null);
  useEffect(() => {
    if (transactionRequest) {
      bottomSheetRef.current?.snapToIndex(0);
    }
  }, [transactionRequest]);
  const dismissBottomSheet = useCallback(() => {
    setTransactionRequest(undefined);
    bottomSheetRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        dismissBottomSheet();
      }
    },
    [dismissBottomSheet],
  );
  return (
    <Portal>
      <BottomSheet
        onChange={handleSheetChanges}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        backdropComponent={CustomBackdrop}
        enablePanDownToClose
        index={-1}>
        <View style={authenticationBottomSheetStyles.container}>
          <Header
            title="Transaction Signing"
            leftComponent={
              <HeaderBack
                textColor={colors.secondary100}
                text="Cancel"
                onPress={dismissBottomSheet}
              />
            }
          />
          <Suspense fallback={<Text>Loading</Text>}>
            <View
              style={[
                authenticationBottomSheetStyles.headerContainer,
                {
                  backgroundColor: colors.card,
                },
              ]}>
              <Image
                style={authenticationBottomSheetStyles.appIcon}
                source={{ uri: transactionRequest?.appDetails?.icon }}
              />
              <Typography
                type={'commonText'}
                style={authenticationBottomSheetStyles.warning}>
                {`Allow ${transactionRequest?.appDetails?.name} to proceed with the decentralized authentication
            process.`}
              </Typography>
            </View>
            <Typography type="bigTitle">{`type: ${
              (transactionRequest as STXTransferPayload)?.txType
            }`}</Typography>
            <Typography type="bigTitle">{`recipient: ${
              (transactionRequest as STXTransferPayload)?.recipient
            }`}</Typography>
            <Typography type="bigTitle">{`amount: ${
              (transactionRequest as STXTransferPayload)?.amount
            }`}</Typography>
          </Suspense>
        </View>
      </BottomSheet>
    </Portal>
  );
};

export default withSuspense(
  TransactionRequestBottomSheet,
  <Text>Loading</Text>,
);
