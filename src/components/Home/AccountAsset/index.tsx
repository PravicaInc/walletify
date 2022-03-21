import React, { useContext } from 'react';
import { View } from 'react-native';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { AccountToken } from '../../../models/account';
import TokenAvatar from '../TokenAvatar';
import styles from './styles';

interface AccountAssetProps {
  item: AccountToken;
  showFullBalance?: boolean;
  fullBalance?: string;
  showCustomAmount?: boolean;
  customAmount?: string;
}

const AccountAsset: React.FC<AccountAssetProps> = props => {
  const { icon, name, amount, isFungible, metaData, defaultStyles } =
    props.item;
  const { showFullBalance, fullBalance, showCustomAmount, customAmount } =
    props;
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <View
      key={name}
      style={[
        styles.tokenCard,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <View style={styles.tokenInformationContainer}>
        <TokenAvatar
          CustomIcon={icon}
          customStyle={defaultStyles}
          tokenName={name}
        />
        <View>
          <Typography style={{ color: colors.primary100 }} type="smallTitleR">
            {name}
          </Typography>
          {isFungible && metaData?.name && (
            <Typography style={{ color: colors.primary40 }} type="commonText">
              {metaData?.name}
            </Typography>
          )}
          {name === 'STX' && (
            <Typography style={{ color: colors.primary40 }} type="commonText">
              Stacks Token
            </Typography>
          )}
        </View>
      </View>
      {!showFullBalance && (
        <View>
          <Typography style={{ color: colors.primary100 }} type="midTitle">
            {showCustomAmount ? customAmount : amount}
          </Typography>
        </View>
      )}
      {showFullBalance && (
        <View style={styles.alignRight}>
          <Typography style={{ color: colors.primary40 }} type="commonText">
            {fullBalance}
          </Typography>
        </View>
      )}
    </View>
  );
};

export default AccountAsset;
