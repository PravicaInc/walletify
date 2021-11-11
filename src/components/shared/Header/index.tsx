import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '../Typography';
import { ThemeContext } from '../../../contexts/theme';

interface IProps {
  leftComponent: React.ReactNode;
  leftComponentWidth?: number; // necessary when we have a left component and title without the right component to center the title
  title?: string;
  rightComponent?: React.ReactNode;
}

const Header: React.FC<IProps> = ({
  title,
  leftComponent,
  leftComponentWidth,
  rightComponent,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  return (
    <View style={styles.headerContainer}>
      {leftComponent}
      {title && (
        <Typography type="smallTitle" style={{ color: colors.primary100 }}>
          {title}
        </Typography>
      )}
      {rightComponent || <View style={{ width: leftComponentWidth }} />}
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
});

export default Header;
