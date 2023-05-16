import React, { useContext } from 'react';
import { StyleProp, TouchableHighlight, View, ViewStyle } from 'react-native';
import { Typography } from '../../shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { AccountToken } from '../../../models/account';
import TokenAvatar from '../TokenAvatar';
import styles from './styles';
import ExpandIcon from '../../../assets/expand.svg';
import { StackActions, useNavigation } from '@react-navigation/native';
import { useStxPriceValue } from '../../../hooks/useStxPrice/useStxPrice';
import { stxToMicroStx, valueFromBalance } from '../../../shared/balanceUtils';

interface AccountAssetProps {
  item: AccountToken;
  style?: StyleProp<ViewStyle>;
  hasPreview?: boolean;
}

const LargeAccountAsset: React.FC<AccountAssetProps> = props => {
  const { item, style, hasPreview } = props;
  const { icon, name, amount, metaData, isFungible, defaultStyles } = item;
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { dispatch } = useNavigation();
  const stxPrice = useStxPriceValue();

  const goToAssetDetails = () =>
    dispatch(StackActions.push('AssetDetails', { asset: item }));

  const extraStyles = style ? [style] : [];

  let title, subtitle, value;

  if (name === 'STX') {
    title = 'Stacks Coins';
    subtitle = 'STX';
    value = `$${valueFromBalance(
      stxToMicroStx(amount).multipliedBy(stxPrice),
      'stx',
      {
        fixedDecimals: false,
      },
    )}`;
  } else {
    title = metaData?.name ?? name;
    subtitle = isFungible ? name.toUpperCase() : name;
  }

  return (
    <TouchableHighlight
      underlayColor={colors.primary10}
      onPress={hasPreview ? goToAssetDetails : undefined}
      style={[
        styles.tokenCard,
        ...extraStyles,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <>
        <View style={styles.tokenInformationContainer}>
          <TokenAvatar
            CustomIcon={icon}
            customStyle={defaultStyles}
            tokenName={metaData?.name ?? name}
            tokenURL={metaData?.image_uri}
          />
          <View style={styles.fullWidth}>
            <Typography style={{ color: colors.text }} type="smallTitleR">
              {subtitle}
            </Typography>
            <Typography
              style={{ color: colors.primary40 }}
              numberOfLines={1}
              type="commonText">
              {title}
            </Typography>
          </View>
        </View>
        <View style={styles.balanceInformationContainer}>
          <Typography style={{ color: colors.primary40 }} type="smallText">
            {isFungible ? 'Balance:' : 'Owned:'}
          </Typography>
          <Typography style={{ color: colors.primary100 }} type="midTitle">
            {amount}
          </Typography>
          <View style={styles.footer}>
            <Typography
              style={[styles.balanceValue, { color: colors.text }]}
              type="commonText">
              {value ? value : ''}
            </Typography>
            {hasPreview && (
              <View
                style={[
                  styles.expandIconContainer,
                  { backgroundColor: colors.white },
                ]}>
                <ExpandIcon fill={colors.primary100} />
              </View>
            )}
          </View>
        </View>
      </>
    </TouchableHighlight>
  );
};

export default LargeAccountAsset;
