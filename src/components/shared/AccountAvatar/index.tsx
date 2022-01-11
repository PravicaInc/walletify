import React, { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Avatar from 'react-native-boring-avatars';

import { ThemeContext } from '../../../contexts/Theme/theme';

interface IProps {
  accountName: string | undefined;
  diameter: number;
  hasAura?: boolean;
  customStyle?: ViewStyle;
}

const AccountAvatar: React.FC<IProps> = props => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const { hasAura, accountName, diameter, customStyle } = props;
  return (
    <View
      style={[
        styles.container,
        {
          height: diameter,
          width: diameter,
          borderRadius: diameter / 2,
        },
        hasAura && styles.aura,
        hasAura && { borderColor: colors.confirm100 },
        customStyle,
      ]}>
      <Avatar
        size={diameter}
        name={accountName}
        variant="sunset"
        colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
  aura: { borderWidth: 1, padding: 2 },
});

export default AccountAvatar;
