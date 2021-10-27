import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Typography } from '../shared/Typography';
import { ThemeContext } from '../../contexts/theme';

type Props = {
  text: string;
  icon: React.FC;
};

const SettingsNextLink = (props: Props) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const Icon = props.icon;

  const textStyle = { color: colors.secondary100, marginLeft: 5 };

  return (
    <View style={styles.container}>
      <Icon />
      <Typography type="buttonText" style={textStyle}>
        {props.text}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});

export default SettingsNextLink;
