import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleProp, TextStyle, View } from 'react-native';
import styles from './styles';
import BottomSheet, { useBottomSheet } from '@gorhom/bottom-sheet';
import { CustomBackdrop, CustomBackground } from '../shared/customBackdrop';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Typography } from '../shared/Typography';
import { Portal } from '@gorhom/portal';
import rnTextSize, { TSFontSpecs } from 'react-native-text-size';
import { Fonts } from '../../assets/fonts';
import { ThemeContext } from '../../contexts/Theme/theme';
import { CARD_ITEM_WIDTH, useGetBottomTabsHeight } from '../../shared/layout';

export interface IPickerOption {
  label: string;
  icon?: SVGElement;
  onClick: () => Promise<any> | void;
  optionTextStyle?: StyleProp<TextStyle>;
  isSelected?: boolean;
}

interface IProps {
  options: IPickerOption[];
  title?: string;
  subTitle?: string;
  userIcon?: SVGElement;
  username?: string;
}
export const OptionsPick = React.forwardRef<BottomSheet, IProps>(
  ({ options, title, username, userIcon, subTitle }, ref) => {
    const {
      theme: { colors },
    } = useContext(ThemeContext);
    const bottomDistance = useGetBottomTabsHeight();
    const [snapPoints, setSnapPoints] = useState<number[]>([1]);
    useEffect(() => {
      const calculate = async () => {
        const subTitleFontSpecs: TSFontSpecs = {
          fontFamily: Fonts.regular,
          fontSize: 12,
        };
        const usernameFontSpecs: TSFontSpecs = {
          fontFamily: Fonts.bold,
          fontSize: 15,
        };
        const titleFontSpecs: TSFontSpecs = {
          fontFamily: Fonts.bold,
          fontSize: 18,
        };
        const [subTitleHeight] = await rnTextSize.flatHeights({
          text: [subTitle || ''],
          width: CARD_ITEM_WIDTH - 40,
          ...subTitleFontSpecs,
        });
        const [titleHeight] = await rnTextSize.flatHeights({
          text: [title || ''],
          width: CARD_ITEM_WIDTH - 40,
          ...titleFontSpecs,
        });
        const [usernameHeight] = await rnTextSize.flatHeights({
          text: [username || ''],
          width: CARD_ITEM_WIDTH - 40,
          ...usernameFontSpecs,
        });
        setSnapPoints([
          bottomDistance +
            (username ? usernameHeight + 5 : 0) +
            (userIcon ? 80 : 0) +
            (userIcon || username ? 40 : 0) +
            (subTitle ? subTitleHeight + 15 : 0) +
            (title ? titleHeight - 10 : 0) +
            60 * (options.length + 1),
        ]);
      };
      calculate();
    }, [options.length, bottomDistance, subTitle, title, userIcon, username]);
    const handleClose = useCallback(() => {
      (ref as any).current.close();
    }, []);
    return (
      <Portal>
        <BottomSheet
          backdropComponent={CustomBackdrop}
          backgroundComponent={CustomBackground}
          ref={ref}
          snapPoints={snapPoints}
          index={-1}
          style={styles.container}
          handleComponent={null}>
          <View
            style={[
              styles.contentContainer,
              { backgroundColor: colors.white },
            ]}>
            {(username || userIcon) && (
              <>
                <View style={styles.user}>
                  {userIcon}
                  {username && (
                    <Typography type="smallTitle" style={styles.username}>
                      {username}
                    </Typography>
                  )}
                </View>
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: colors.primary20 },
                  ]}
                />
              </>
            )}
            {subTitle && (
              <>
                {title && (
                  <Typography
                    type="midTitle"
                    style={[styles.title, { color: colors.primary100 }]}>
                    {title}
                  </Typography>
                )}
                <Typography
                  type="commonText"
                  style={[styles.subTitle, { color: colors.primary40 }]}>
                  {subTitle}
                </Typography>
                <View
                  style={[
                    styles.separator,
                    { backgroundColor: colors.primary20 },
                  ]}
                />
              </>
            )}
            {options.map((option, index) => {
              return (
                <Option
                  key={option.label}
                  isLast={index === options.length - 1}
                  option={option}
                />
              );
            })}
          </View>
          <View
            style={[
              styles.cancelWrapper,
              {
                backgroundColor: colors.white,
              },
            ]}>
            <TouchableHighlight
              underlayColor={colors.primary10}
              onPress={handleClose}
              style={styles.cancel}>
              <Typography
                style={{ color: colors.secondary100 }}
                type="smallTitle">
                Cancel
              </Typography>
            </TouchableHighlight>
          </View>
        </BottomSheet>
      </Portal>
    );
  },
);

interface IOptionProps {
  option: IPickerOption;
  isLast: boolean;
}
const Option: React.FC<IOptionProps> = ({ option, isLast }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  const { close } = useBottomSheet();
  const handleSelectOption = useCallback(async () => {
    await option.onClick();
    close();
  }, [close, option]);
  return (
    <TouchableHighlight
      underlayColor={colors.card}
      onPress={handleSelectOption}
      style={[
        styles.option,
        {
          borderBottomColor: colors.primary10,
          borderBottomWidth: isLast ? 0 : 0.5,
          justifyContent: option.icon ? 'flex-start' : 'center',
        },
      ]}>
      <>
        {option.icon}
        <Typography
          type={option.isSelected ? 'smallTitle' : 'buttonText'}
          style={[
            option.icon && styles.name,
            { color: colors.secondary100 },
            option.optionTextStyle,
          ]}>
          {option.label}
        </Typography>
      </>
    </TouchableHighlight>
  );
};
