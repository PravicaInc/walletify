import React, { useContext } from 'react';
import { ActivityIndicator, StyleProp, View, ViewStyle } from 'react-native';
import styles from './styles';
import { ThemeContext } from '../../contexts/Theme/theme';
import { Typography } from '../shared/Typography';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Chevron from '../../assets/chevron-right.svg';

interface IProps {
  handleGoBack?: () => void;
  handleGoNext?: () => void;
  handleTitleClicked?: () => void;
  noBackText?: boolean;
  isCancel?: boolean;
  disableFullWidth?: boolean;
  isNextDisabled?: boolean;
  isNextLoading?: boolean;
  loadingText?: string;
  backColor?: string;
  image?: React.ReactNode;
  customNext?: React.ReactNode;
  title?: string;
  subTitle?: string;
  nextButtonText?: string;
  containerStyle?: StyleProp<ViewStyle>;
}
export const CustomAppHeader: React.FC<IProps> = ({
  isCancel,
  handleGoBack,
  handleGoNext,
  handleTitleClicked,
  nextButtonText,
  title,
  isNextDisabled,
  image,
  noBackText,
  disableFullWidth,
  containerStyle,
  isNextLoading,
  loadingText,
  subTitle,
  backColor,
  customNext,
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext);

  return (
    <View
      style={[
        styles.header,
        {
          shadowColor: colors.primary40,
          backgroundColor: colors.white,
        },
        containerStyle,
      ]}>
      {handleGoBack && (
        <View style={disableFullWidth ? styles.normal : styles.fullWidth}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={styles.backWrapper}
            onPress={handleGoBack}>
            {!isCancel && (
              <Chevron
                width={7.5}
                height={13.5}
                style={styles.arrow}
                fill={backColor || colors.primary100}
              />
            )}
            {!noBackText && (
              <Typography
                type="buttonText"
                style={{ color: backColor || colors.primary100 }}>
                {isCancel ? 'Cancel' : 'Back'}
              </Typography>
            )}
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity onPress={handleTitleClicked} activeOpacity={0.6}>
        {image}
      </TouchableOpacity>
      <View
        style={[
          disableFullWidth ? styles.normal : styles.fullWidth,
          styles.titleWrapper,
        ]}>
        {title && (
          <TouchableOpacity
            onPress={handleTitleClicked}
            activeOpacity={handleTitleClicked ? 0.6 : 1}>
            <Typography
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.title,
                {
                  textAlign: disableFullWidth ? 'left' : 'center',
                },
              ]}
              type="smallTitle">
              {title}
            </Typography>
          </TouchableOpacity>
        )}
        {subTitle && (
          <TouchableOpacity onPress={handleTitleClicked} activeOpacity={0.6}>
            <Typography style={{ color: colors.primary10 }} type="commonText">
              {subTitle}
            </Typography>
          </TouchableOpacity>
        )}
      </View>
      {handleGoNext ? (
        <View style={disableFullWidth ? styles.normal : styles.fullWidth}>
          <TouchableOpacity
            disabled={isNextDisabled || isNextLoading}
            style={styles.create}
            activeOpacity={0.6}
            onPress={handleGoNext}>
            {isNextLoading ? (
              <ActivityIndicator color={colors.primary40} />
            ) : null}
            <Typography
              style={{
                color:
                  isNextDisabled || isNextLoading
                    ? colors.primary40
                    : colors.primary100,
              }}
              type="buttonText">
              {isNextLoading ? loadingText : nextButtonText}
            </Typography>
          </TouchableOpacity>
        </View>
      ) : customNext ? (
        customNext
      ) : (
        <View style={styles.fullWidth} />
      )}
    </View>
  );
};
