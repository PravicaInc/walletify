import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Alert, Image, Linking, ScrollView, View } from 'react-native';
import ContentLoader from 'react-content-loader/native';
import { ThemeContext } from '../../contexts/Theme/theme';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { Typography } from '../shared/Typography';
import styles from './styles';
import { useAtomValue } from 'jotai/utils';
import { withSuspense } from '../shared/WithSuspense';
import { CustomBackdrop } from '../shared/customBackdrop';
import { isValidUrl } from '../../hooks/auth/useAuthRequest';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import { isIosApp, titleCase } from '../../shared/helpers';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Portal } from '@gorhom/portal';
import {
  SignatureData,
  SignaturePayload,
  TransactionTypes,
} from '../../shared/types';
import GeneralButton from '../shared/GeneralButton';
import {
  signMessage,
  signStructuredDataMessage,
} from '../../shared/signMessage';
import {
  createStacksPrivateKey,
  deserializeCV,
} from '@stacks/transactions/dist';
import { transactionRequestTokenPayloadState } from '../../hooks/transactions/requests';
import { useTransactionRequest } from '../../hooks/transactions/useTransactionRequest';

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const SignatureRequestBottomSheet: React.FC = () => {
  const snapPoints = React.useMemo(() => ['95%'], []);
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const transactionRequest = useAtomValue(transactionRequestTokenPayloadState);
  const setTransactionRequest = useTransactionRequest();
  const bottomSheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    if (
      transactionRequest &&
      transactionRequest.txType === TransactionTypes.SignMessage
    ) {
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
        style={{ backgroundColor: colors.white }}
        backgroundStyle={{ backgroundColor: colors.white }}
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={null}
        backdropComponent={CustomBackdrop}
        enablePanDownToClose
        index={-1}>
        {transactionRequest?.txType === TransactionTypes.SignMessage && (
          <WrappedSignatureRequestBottomSheetInner
            dismissBottomSheet={dismissBottomSheet}
          />
        )}
      </BottomSheet>
    </Portal>
  );
};

export default SignatureRequestBottomSheet;

interface SignatureRequestInnerProps {
  dismissBottomSheet: () => void;
}

const SignatureRequestBottomSheetInner: React.FC<
  SignatureRequestInnerProps
> = ({ dismissBottomSheet }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { bottom } = useSafeAreaInsets();
  const transactionRequest = useAtomValue(transactionRequestTokenPayloadState);
  const transferPayload = transactionRequest as SignaturePayload;
  const { walletAccounts, switchAccount } = useAccounts();
  const account = walletAccounts?.find(
    acc => acc.address === transferPayload?.stxAddress,
  );
  useEffect(() => {
    if (account) {
      switchAccount(account?.index);
    }
  }, [account]);
  const [isSending, toggleSending] = useState<boolean>(false);
  const handSendPress = async () => {
    if (!transactionRequest || !transferPayload || !account?.stxPrivateKey) {
      return;
    }

    const dangerousUri = transactionRequest.redirect_uri;
    if (!isValidUrl(dangerousUri) || dangerousUri.includes('javascript')) {
      Alert.alert('Cannot proceed auth with malformed url');
    }

    toggleSending(true);
    try {
      const privateKey = createStacksPrivateKey(account?.stxPrivateKey);
      let response: SignatureData;
      if (isString(transferPayload.message)) {
        response = await signMessage(transferPayload.message, privateKey);
      } else {
        response = await signStructuredDataMessage(
          transferPayload.message,
          // eslint-disable-next-line no-undef
          deserializeCV(Buffer.from(dangerousUri, 'hex')),
          privateKey,
        );
      }
      toggleSending(false);
      const requestResult = {
        ...(transactionRequest.metadata || {}),
        response,
      };
      const redirect = `${dangerousUri}?sigResult=${JSON.stringify(
        requestResult,
      )}`;
      Linking.openURL(redirect);
      dismissBottomSheet();
    } catch (e) {
      Alert.alert(titleCase(e), `Failure reason: ${e}`);
      toggleSending(false);
    }
  };
  const ctaButton = (
    <GeneralButton
      loading={isSending}
      canGoNext
      onClick={handSendPress}
      text={'Confirm'}
    />
  );
  return (
    <View style={[styles.container, { paddingBottom: bottom + 10 }]}>
      <Header
        containerStyles={styles.header}
        title="Sign Message"
        titleColor={colors.text}
        leftComponent={
          <HeaderBack
            textColor={colors.secondary100}
            text="Cancel"
            onPress={dismissBottomSheet}
          />
        }
        rightComponent={isIosApp && ctaButton}
      />
      <Suspense fallback={<ContentLoader />}>
        <View
          style={[
            styles.headerContainer,
            {
              backgroundColor: colors.card,
            },
          ]}>
          <View
            style={[styles.appIconWrapper, { backgroundColor: colors.white }]}>
            <Image
              style={styles.appIcon}
              source={{ uri: transactionRequest?.appDetails?.icon }}
            />
          </View>
          <Typography
            type={'commonText'}
            style={[styles.warning, { color: colors.primary100 }]}>
            {`By signing this message, you are authorizing ${transactionRequest?.appDetails?.name} to do something specific on your behalf. Only sign messages that you understand from apps that you trust.`}
          </Typography>
        </View>
        {transferPayload && account && (
          <View style={[styles.message, { backgroundColor: colors.card }]}>
            <ScrollView
              indicatorStyle={'white'}
              horizontal
              style={styles.messageView}>
              <Typography type={'smallTitleR'}>
                {JSON.stringify(JSON.parse(transferPayload.message), null, 2)}
              </Typography>
            </ScrollView>
          </View>
        )}
      </Suspense>
      {!isIosApp && ctaButton}
    </View>
  );
};

const WrappedSignatureRequestBottomSheetInner = withSuspense(
  SignatureRequestBottomSheetInner,
  <ContentLoader />,
);
