import MaskedView from '@react-native-masked-view/masked-view';
import React, { useContext } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Text, TextProps } from 'react-native';
import { ThemeContext } from '../../contexts/Theme/theme';

interface Coordinate {
  x: number;
  y: number;
}

interface Props extends TextProps {
  colors?: string[];
  start?: Coordinate;
  end?: Coordinate;
}

const GradientText: React.FC<Props> = ({
  colors,
  style,
  start,
  end,
  ...props
}) => {
  const {
    theme: { colors: themeColors },
  } = useContext(ThemeContext);
  return (
    <MaskedView maskElement={<Text style={style} {...props} />}>
      <LinearGradient
        colors={
          colors || [
            themeColors.gradient1,
            themeColors.gradient2,
            themeColors.gradient3,
          ]
        }
        start={start || { x: 0, y: 0 }}
        end={end || { x: 1, y: 1 }}>
        <Text {...props} style={[style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
