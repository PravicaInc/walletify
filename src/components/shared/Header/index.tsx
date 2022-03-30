import React, { useContext } from 'react';
import { View, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Typography } from '../Typography';
import { ThemeContext } from '../../../contexts/Theme/theme';

interface IProps {
  leftComponent: React.ReactNode;
  title?: string;
  titleColor?: string;
  rightComponent?: React.ReactNode;
  isRightLoading?: boolean;
  containerStyles?: ViewStyle;
}

const Header: React.FC<IProps> = ({
  title,
  titleColor,
  leftComponent,
  rightComponent,
  isRightLoading,
  containerStyles,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  return (
    <View style={[styles.headerContainer, containerStyles]}>
      <View style={styles.lateral}>{leftComponent}</View>
      {title && (
        <Typography
          type="smallTitle"
          style={{ color: titleColor || colors.primary100 }}>
          {title}
        </Typography>
      )}
      <View style={[styles.lateral, styles.right]}>
        {isRightLoading ? (
          <ActivityIndicator color={colors.primary40} />
        ) : (
          rightComponent
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  lateral: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
});

export default Header;
