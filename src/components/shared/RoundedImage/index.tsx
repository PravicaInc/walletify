import React, { useContext } from 'react';
import { StyleSheet, View, ViewStyle, ImagePropTypes } from 'react-native';

import { ThemeContext } from '../../../contexts/theme';

interface IProps {
  image: React.FC;
  diameter: number;
  hasAura?: boolean;
  customStyle?: ViewStyle;
}

const RoundedImage: React.FC<IProps> = props => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);
  const ImgComponent = props.image;

  const containerStyle = [
    styles.container,
    {
      height: props.diameter + 6,
      width: props.diameter + 6,
      borderRadius: props.diameter / 2 + 4,
    },
    props.hasAura && {
      padding: 2,
      borderColor: colors.confirm100,
      borderWidth: 1,
    },
    props.customStyle,
  ];

  const imgStyle = { borderRadius: props.diameter / 2 };
  return (
    <View style={containerStyle}>
      <ImgComponent
        width={props.diameter}
        height={props.diameter}
        style={imgStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { overflow: 'hidden' },
});

export default RoundedImage;
