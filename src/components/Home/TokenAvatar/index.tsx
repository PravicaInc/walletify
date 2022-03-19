import React, { useContext, useMemo } from 'react';
import { View, ViewStyle } from 'react-native';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { Typography } from '../../shared/Typography';
import styles from './styles';

interface TokenAvatarProps {
  tokenName: string;
  customStyle?: ViewStyle;
  CustomIcon?: any;
  iconDimension?: number;
}

const backgrounds = ['#7DADF9', '#FFB662', '#9694FF', '#FF9494', '#9FF2A8'];

const TokenAvatar: React.FC<TokenAvatarProps> = ({
  customStyle,
  tokenName,
  CustomIcon,
  iconDimension,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const selectedColor = useMemo(
    () => backgrounds[parseInt(tokenName, 36) % backgrounds.length],
    [tokenName],
  );
  return (
    <View
      style={[
        styles.avatarContainer,
        {
          backgroundColor: selectedColor,
        },
        customStyle,
      ]}>
      {CustomIcon ? (
        <CustomIcon with={iconDimension || 18} height={iconDimension || 18} />
      ) : (
        <Typography
          type="bigTitle"
          style={[styles.avatarInitial, { color: colors.white }]}>
          {tokenName[0]}
        </Typography>
      )}
    </View>
  );
};

export default TokenAvatar;
