import React, { useContext } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Avatar from 'react-native-boring-avatars';

import { ThemeContext } from '../../../contexts/Theme/theme';

interface IProps {
  accountIndex: number;
  diameter: number;
  hasAura?: boolean;
  customStyle?: ViewStyle;
}

const AccountAvatar: React.FC<IProps> = props => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.container,
        {
          height: props.diameter + 6,
          width: props.diameter + 6,
          borderRadius: props.diameter / 2 + 4,
        },
        props.hasAura && styles.aura,
        props.hasAura && { borderColor: colors.confirm100 },
        props.customStyle,
      ]}>
      <Avatar
        size={props.diameter}
        name="Mary Baker"
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
