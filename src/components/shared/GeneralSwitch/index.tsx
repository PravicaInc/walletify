import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Switch } from 'react-native-switch';

interface IProps {
  isLocked: boolean;
  toggleLock: (val: boolean) => void;
  backgroundActive?: string;
  backgroundInactive?: string;
  barHeight?: number;
  circleSize?: number;
  customStyle?: ViewStyle;
  switchCircleStyle?: StyleProp<ViewStyle>;
  icon?: React.ReactNode;
  switchPx?: number;
}
export const GeneralSwitch: React.FC<IProps> = ({
  isLocked,
  toggleLock,
  backgroundActive,
  backgroundInactive,
  customStyle,
  switchCircleStyle,
  icon,
  barHeight,
  circleSize,
  switchPx,
}) => {
  return (
    <Switch
      value={isLocked}
      onValueChange={toggleLock}
      circleSize={circleSize}
      barHeight={barHeight}
      backgroundActive={backgroundActive}
      backgroundInactive={backgroundInactive}
      changeValueImmediately={true}
      circleBorderWidth={0}
      renderInsideCircle={() => <View style={switchCircleStyle}>{icon}</View>}
      renderActiveText={false}
      renderInActiveText={false}
      switchLeftPx={switchPx}
      switchRightPx={switchPx}
      containerStyle={customStyle}
      switchWidthMultiplier={2}
      switchBorderRadius={21}
    />
  );
};
