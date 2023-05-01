import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { Alert, Image, Linking, View } from 'react-native';
import ContentLoader from 'react-content-loader/native';
import { ThemeContext } from '../../contexts/Theme/theme';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { Typography } from '../shared/Typography';
import styles from './styles';
import { useAtomValue } from 'jotai/utils';
import { withSuspense } from '../shared/WithSuspense';
import { CustomBackdrop } from '../shared/customBackdrop';
import { signatureRequestTokenPayloadState } from '../../hooks/transactions/requests';
import { useSignatureRequest } from '../../hooks/transactions/useTransactionRequest';
import { isValidUrl } from '../../hooks/auth/useAuthRequest';
import { useAccounts } from '../../hooks/useAccounts/useAccounts';
import WarningIcon from '../shared/WarningIcon';
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

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

const SignatureRequestBottomSheet: React.FC = () => {
  const snapPoints = React.useMemo(() => ['95%'], []);
  const transactionRequest = useAtomValue(signatureRequestTokenPayloadState);
  const setTransactionRequest = useSignatureRequest();

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
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        handleComponent={null}
        backdropComponent={CustomBackdrop}
        enablePanDownToClose
        index={-1}>
        <WrappedSignatureRequestBottomSheetInner
          dismissBottomSheet={dismissBottomSheet}
        />
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
  const transactionRequest = useAtomValue(signatureRequestTokenPayloadState);
  const transferPayload = transactionRequest as SignaturePayload;
  const { selectedAccountState: account } = useAccounts();
  const [isSending, toggleSending] = useState<boolean>(false);
  const handSendPress = useCallback(() => {
    async function handleTransfer() {
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
          response = signMessage(transferPayload.message, privateKey);
        } else {
          response = signStructuredDataMessage(
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
        const redirect = `${dangerousUri}?txResult=${JSON.stringify(
          requestResult,
        )}`;
        Linking.openURL(redirect);
        dismissBottomSheet();
      } catch (e) {
        Alert.alert(titleCase(e), `Failure reason: ${e}`);
      }
    }

    if (transactionRequest) {
      handleTransfer();
    }
  }, [transactionRequest, account]);
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
        title="Transaction Signing"
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
          <Typography type={'commonText'} style={styles.warning}>
            {`${transactionRequest?.appDetails?.name} asks for your signature to proceed with this transaction, Please make sure transaction parameters are correct.`}
          </Typography>
        </View>
        {transferPayload && account && <>// TODO: UI implementation here</>}
      </Suspense>
      <View style={[styles.horizontalFill, styles.centerItems]}>
        <WarningIcon width={24} height={24} fill={colors.primary60} />
        <Typography
          type="commonText"
          style={[
            styles.warningText,
            {
              color: colors.primary60,
            },
          ]}>
          If you confirm this transaction it is not reversible. Make sure all
          inputs are correct.
        </Typography>
      </View>
      {!isIosApp && ctaButton}
    </View>
  );
};

const WrappedSignatureRequestBottomSheetInner = withSuspense(
  SignatureRequestBottomSheetInner,
  <ContentLoader />,
);
