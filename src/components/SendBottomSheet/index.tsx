import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { View, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { CustomBackdrop } from '../shared/customBackdrop';
import styles from './styles';
import Header from '../shared/Header';
import HeaderBack from '../shared/HeaderBack';
import { ThemeContext } from '../../contexts/Theme/theme';
import { Typography } from '../shared/Typography';
import Stx from '../../assets/images/stx.svg';
import TokenAvatar from '../Home/TokenAvatar';
import SimpleTextInput from './SimpleTextInput';
import ScanQr from '../../assets/images/scanQr.svg';
import GeneralButton from '../shared/GeneralButton';
import ScanQrBottomSheet from '../ScanQrBottomSheet';
import { selectedAccount } from '../../hooks/useAccounts/accountsStore';
import { useAtomValue } from 'jotai/utils';
import { truncateAddress } from '../../shared/addressUtils';
import { apiClientState } from '../../hooks/apiClients/apiClients';
import useNetwok from '../../hooks/useNetwork/useNetwork';
import WarningIcon from '../shared/WarningIcon';

type Props = {
  handleNextAction: (password: string, seedPhrase: string) => void;
  fullBalance: any;
  price: any;
};

const SendBottomSheet = React.forwardRef<any, Props>(
  ({ handleNextAction, fullBalance, price }, ref) => {
    const qrScanRef = useRef<BottomSheetModal>(null);

    const account = useAtomValue(selectedAccount);

    const { feesApi } = useAtomValue(apiClientState);

    const { currentNetwork } = useNetwok();

    const handlePresentQrScan = useCallback(() => {
      qrScanRef.current?.snapToIndex(0);
    }, []);

    const snapPoints = useMemo(() => ['92%'], []);

    const {
      theme: { colors },
    } = useContext(ThemeContext);

    const [amount, setAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [memo, setMemo] = useState('');
    const [preview, setPreview] = useState(false);
    const [fees, setFees] = useState(null);

    useEffect(() => {
      const fetchFees = async () => {
        const feeTransfer = await feesApi.getFeeTransfer();
        setFees(feeTransfer);
      };
      if (preview) {
        fetchFees();
      }
    }, [preview]);

    const dismissBottomSheet = useCallback(() => {
      ref.current?.close();
    }, []);
    const isReadyForPreview = amount && recipient;

    const truncatedRecipient = truncateAddress(recipient, 11);

    const truncatedSender = truncateAddress(account?.address, 11);

    return (
      <Portal>
        <BottomSheet
          snapPoints={snapPoints}
          ref={ref}
          index={-1}
          handleComponent={null}
          enablePanDownToClose
          backdropComponent={CustomBackdrop}>
          <View style={styles.container}>
            {preview ? (
              <>
                <Header
                  title="Send"
                  leftComponent={
                    <HeaderBack
                      textColor={colors.secondary100}
                      text="Back"
                      hasChevron
                      onPress={() => setPreview(false)}
                    />
                  }
                />
                <View style={styles.inputsContainer}>
                  <View style={{ width: '100%' }}>
                    <View
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 24,
                        width: '100%',
                        paddingHorizontal: 21,
                        paddingVertical: 14,
                      }}>
                      <Typography
                        type="commonText"
                        style={{ color: colors.primary40 }}>
                        You Will Send
                      </Typography>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row' }}>
                          <TokenAvatar
                            CustomIcon={<Stx />}
                            customStyle={{ backgroundColor: colors.primary100 }}
                            tokenName={'STX'}
                          />
                          <Typography type="bigTitle">{amount}</Typography>
                        </View>
                        <Typography
                          type="buttonText"
                          style={{ color: colors.primary40 }}>
                          STX
                        </Typography>
                      </View>
                      <Typography type="smallTitleR">Stacks Coin</Typography>
                      <View
                        style={{
                          width: '100%',
                          borderBottomWidth: 0.5,
                          borderTopWidth: 0.5,
                          borderTopColor: colors.primary20,
                          borderBottomColor: colors.primary20,
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: 20,
                        }}>
                        <View>
                          <Typography
                            type="commonText"
                            style={{ color: colors.primary40 }}>
                            From
                          </Typography>
                          <Typography type="smallTitleR">
                            {`(${truncatedSender})`}
                          </Typography>
                        </View>
                        <View>
                          <Typography
                            type="commonText"
                            style={{ color: colors.primary40 }}>
                            To
                          </Typography>
                          <Typography type="smallTitleR">
                            {`(${truncatedRecipient})`}
                          </Typography>
                        </View>
                      </View>
                      <Typography
                        type="commonText"
                        style={{ color: colors.primary40 }}>
                        Memo
                      </Typography>
                      <Typography type="commonText">{memo}</Typography>
                    </View>
                    <View style={{ width: '100%' }}>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: 21,
                        }}>
                        <Typography
                          type="commonText"
                          style={{ color: colors.primary40 }}>
                          Fees
                        </Typography>
                        <Typography
                          type="commonText"
                          style={{ color: colors.primary40 }}>
                          {`${fees} STX`}
                        </Typography>
                      </View>
                      <View
                        style={{
                          width: '100%',
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingHorizontal: 21,
                        }}>
                        <Typography
                          type="commonText"
                          style={{ color: colors.primary40 }}>
                          Network
                        </Typography>
                        <Typography
                          type="commonText"
                          style={{ color: colors.primary40 }}>
                          {currentNetwork.name}
                        </Typography>
                      </View>
                    </View>
                  </View>
                  <View style={{ width: '100%', alignItems: 'center' }}>
                    <WarningIcon fill={colors.primary60} />
                    <Typography
                      type="commonText"
                      style={{ color: colors.primary60, textAlign: 'center' }}>
                      If you confirm this transaction it is not reversable. Make
                      sure all arguments are correct.
                    </Typography>
                    <GeneralButton
                      type="activePrimary"
                      // onPress={() => setPreview(true)}
                    >
                      Send
                    </GeneralButton>
                  </View>
                </View>
              </>
            ) : (
              <>
                <Header
                  title="Send"
                  leftComponent={
                    <HeaderBack
                      textColor={colors.secondary100}
                      text="Cancel"
                      onPress={dismissBottomSheet}
                    />
                  }
                />

                <View style={styles.inputsContainer}>
                  <View style={styles.horizontalFill}>
                    <View style={styles.horizontalFill}>
                      <Typography
                        type="commonText"
                        style={{ color: colors.primary40 }}>
                        Select Asset
                      </Typography>
                      <View
                        style={[
                          styles.tokenCard,
                          {
                            backgroundColor: colors.card,
                          },
                        ]}>
                        <View style={styles.tokenInformationContainer}>
                          <TokenAvatar
                            CustomIcon={<Stx />}
                            customStyle={{ backgroundColor: colors.primary100 }}
                            tokenName={'STX'}
                          />
                          <View>
                            <Typography
                              style={{ color: colors.primary100 }}
                              type="smallTitleR">
                              {'Stacks Coins'}
                            </Typography>
                            <Typography
                              style={{ color: colors.primary40 }}
                              type="commonText">
                              STX
                            </Typography>
                          </View>
                        </View>
                        <View style={styles.alignRight}>
                          <Typography
                            style={{ color: colors.primary40 }}
                            type="commonText">
                            {`~ $${fullBalance}`}
                          </Typography>
                        </View>
                      </View>
                    </View>
                    <View style={styles.horizontalFill}>
                      <SimpleTextInput
                        onChangeText={setAmount}
                        value={amount}
                        label="Amount To Send"
                        placeholder="0.00000000"
                        keyboardType="decimal-pad"
                        icon={
                          <Typography
                            type="smallTitleR"
                            style={{ color: colors.primary40 }}>
                            STX
                          </Typography>
                        }
                        subtext={
                          <Typography
                            type="commonText"
                            style={[
                              {
                                color: colors.primary40,
                              },
                              styles.alignRight,
                            ]}>
                            {`~ $${(+amount * price).toFixed(2)}`}
                          </Typography>
                        }
                      />
                      <SimpleTextInput
                        onChangeText={setRecipient}
                        value={recipient}
                        label="Recipient Address"
                        placeholder="Enter an address"
                        icon={
                          <TouchableOpacity onPress={handlePresentQrScan}>
                            <ScanQr />
                          </TouchableOpacity>
                        }
                      />
                      <ScanQrBottomSheet
                        ref={qrScanRef}
                        setRecipient={setRecipient}
                      />
                      <SimpleTextInput
                        onChangeText={setMemo}
                        value={memo}
                        label=" Memo (For exchanges)"
                        placeholder="Enter a memo"
                        subtext={
                          <Typography
                            type="commonText"
                            style={{ color: colors.primary40 }}>
                            If you are sending to an exchange, be sure to
                            include the memo the exchange provided so the STX is
                            credited to your account
                          </Typography>
                        }
                      />
                    </View>
                  </View>
                  {isReadyForPreview ? (
                    <GeneralButton
                      type="activePrimary"
                      onPress={() => setPreview(true)}>
                      Preview
                    </GeneralButton>
                  ) : (
                    <GeneralButton type="inactivePrimary">
                      Preview
                    </GeneralButton>
                  )}
                </View>
              </>
            )}
          </View>
        </BottomSheet>
      </Portal>
    );
  },
);

export default SendBottomSheet;
