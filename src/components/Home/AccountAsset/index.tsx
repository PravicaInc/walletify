import React, { useContext } from 'react';
import { View } from 'react-native';
import { Typography } from '../../../components/shared/Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { AccountToken } from '../../../models/account';
import TokenAvatar from '../TokenAvatar';
import fungibleTokenStyles from './styles';

interface AccountAssetProps {
  item: AccountToken;
}

const AccountAsset: React.FC<AccountAssetProps> = props => {
  const { icon, name, amount, isFungible, metaData, defaultStyles } =
    props.item;
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  return (
    <View
      key={name}
      style={[
        fungibleTokenStyles.tokenCard,
        {
          backgroundColor: colors.card,
        },
      ]}>
      <View style={fungibleTokenStyles.tokenInformationContainer}>
        <TokenAvatar
          CustomIcon={icon}
          customStyle={defaultStyles}
          tokenName={name}
        />
        <View>
          <Typography style={{ color: colors.primary100 }} type="smallTitleR">
            {name}
          </Typography>
          {isFungible && (
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
      <View>
        <Typography style={{ color: colors.primary100 }} type="midTitle">
          {amount}
        </Typography>
      </View>
    </View>
  );
};

export default AccountAsset;
