import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Image, View, ViewStyle } from 'react-native';
import { ThemeContext } from '../../../contexts/Theme/theme';
import { Typography } from '../../shared/Typography';
import styles from './styles';

interface TokenAvatarProps {
  tokenName: string;
  customStyle?: ViewStyle;
  CustomIcon?: any;
  tokenURL?: string;
  showTokenSymbol?: boolean;
  iconDimension?: number;
}

const backgrounds = ['#7DADF9', '#FFB662', '#9694FF', '#FF9494', '#9FF2A8'];

const TokenAvatar: React.FC<TokenAvatarProps> = ({
  customStyle,
  tokenName,
  CustomIcon,
  iconDimension,
  tokenURL,
  showTokenSymbol,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const selectedColor = useMemo(
    () => backgrounds[parseInt(tokenName, 36) % backgrounds.length],
    [tokenName],
  );
  const [hasRemoteImage, toggleRemoteImage] = useState<boolean>(true);
  const handleError = useCallback(() => {
    toggleRemoteImage(false);
  }, []);
  return (
    <View
      style={[
        styles.avatarContainer,
        {
          backgroundColor: colors.defaultBlack,
        },
        customStyle,
        !(hasRemoteImage && !!tokenURL) && showTokenSymbol
          ? {
              width: undefined,
              height: undefined,
              backgroundColor: 'transparent',
            }
          : {},
      ]}>
      {hasRemoteImage && !!tokenURL ? (
        <Image
          style={styles.tokenImage}
          source={{ uri: tokenURL }}
          onError={handleError}
        />
      ) : CustomIcon ? (
        <CustomIcon with={iconDimension || 18} height={iconDimension || 18} />
      ) : (
        <Typography
          type={showTokenSymbol ? 'hugeText' : 'bigTitle'}
          style={[
            styles.avatarInitial,
            {
              color: showTokenSymbol ? colors.textColor : colors.white,
            },
          ]}>
          {showTokenSymbol ? tokenName : tokenName[0]}
        </Typography>
      )}
    </View>
  );
};

export default TokenAvatar;
