import React, { useContext } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import styles from './styles';
import { ThemeContext } from '../../contexts/Theme/theme';
import { Typography } from '../shared/Typography';
import { truncateAddress } from '../../shared/addressUtils';
import useNetwork from '../../hooks/useNetwork/useNetwork';
import AccountAsset from '../Home/AccountAsset';
import { AccountToken } from '../../models/account';

type Props = {
  sender: string;
  recipient: string;
  memo?: string;
  amount: number;
  fees: number;
  selectedAsset: AccountToken;
  style?: StyleProp<ViewStyle> | undefined;
};

const PreviewTransfer = ({
  sender,
  recipient,
  memo,
  amount,
  fees,
  selectedAsset,
  style: externalStyle,
}: Props) => {
  const { currentNetwork } = useNetwork();

  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const truncatedRecipient = truncateAddress(recipient, 11);
  const truncatedSender = truncateAddress(sender, 11);

  return (
    <View
      style={
        externalStyle
          ? [styles.horizontalFill, externalStyle]
          : [styles.horizontalFill]
      }>
      <View
        style={[
          styles.previewCard,
          {
            backgroundColor: colors.card,
          },
        ]}>
        <Typography type="commonText" style={{ color: colors.primary40 }}>
          You Will Send
        </Typography>
        <AccountAsset
          item={selectedAsset}
          showCustomAmount
          customAmount={`${amount}`}
        />
        <View
          style={[
            styles.transactionDetails,
            {
              borderTopColor: colors.primary20,
              borderBottomColor: colors.primary20,
            },
          ]}>
          <View>
            <Typography type="commonText" style={{ color: colors.primary40 }}>
              From
            </Typography>
            <Typography type="smallTitleR">{`(${truncatedSender})`}</Typography>
          </View>
          <View>
            <Typography type="commonText" style={{ color: colors.primary40 }}>
              To
            </Typography>
            <Typography type="smallTitleR">
              {`(${truncatedRecipient})`}
            </Typography>
          </View>
        </View>
        <Typography type="commonText" style={{ color: colors.primary40 }}>
          Memo
        </Typography>
        <Typography type="commonText">{memo ? memo : ''}</Typography>
      </View>
      <View style={styles.horizontalFill}>
        <View style={styles.transactionMetadataItem}>
          <Typography type="commonText" style={{ color: colors.primary40 }}>
            Fees
          </Typography>
          <Typography type="commonText" style={{ color: colors.primary40 }}>
            {`${fees} STX`}
          </Typography>
        </View>
        <View style={styles.transactionMetadataItem}>
          <Typography type="commonText" style={{ color: colors.primary40 }}>
            Network
          </Typography>
          <Typography type="commonText" style={{ color: colors.primary40 }}>
            {currentNetwork.name}
          </Typography>
        </View>
      </View>
    </View>
  );
};

export default PreviewTransfer;
