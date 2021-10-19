import * as React from 'react';
import { Animated, StyleProp, TextProps, TextStyle } from 'react-native';
import { useContext, useMemo } from 'react';
import { findAll } from 'highlight-words-core';
import { ThemeContext } from '../../../contexts/theme';

export const BIG_TITLE = 'bigTitle';
export type bigTitleType = typeof BIG_TITLE;
export const MID_TITLE = 'midTitle';
export type midTitleType = typeof MID_TITLE;
export const SMALL_TITLE = 'smallTitle';
export type smallTitleType = typeof SMALL_TITLE;
export const SMALL_TITLE_R = 'smallTitleR';
export type smallTitleRType = typeof SMALL_TITLE_R;
export const BUTTON_TEXT = 'buttonText';
export type buttonTextType = typeof BUTTON_TEXT;
export const COMMON_TEXT = 'commonText';
export type commonTextType = typeof COMMON_TEXT;
export const COMMON_TEXT_BOLD = 'commonTextBold';
export type commonTextBoldType = typeof COMMON_TEXT_BOLD;
export const SMALL_TEXT = 'smallText';
export type smallTextType = typeof SMALL_TEXT;
export const SMALL_TEXT_BOLD = 'smallTextBold';
export type smallTextBoldType = typeof SMALL_TEXT_BOLD;
export const LINK = 'link';
export type linkType = typeof LINK;

export type StylesTypes =
  | bigTitleType
  | midTitleType
  | smallTitleType
  | smallTitleRType
  | buttonTextType
  | commonTextType
  | smallTextType
  | smallTextBoldType
  | commonTextBoldType
  | linkType;

interface IStyleTypeProps {
  fontFamily: string;
  fontSize: number;
}
interface Chunk {
  highlight: boolean;
  start: number;
  end: number;
}
interface IProps extends TextProps {
  style?: StyleProp<TextStyle>;
  type: StylesTypes;
  autoEscape?: boolean;
  highlightStyle?: StyleProp<TextStyle>;
  highlightClick?: (val: string) => void;
  searchWords?: string[];
  animationValue?: Animated.AnimatedInterpolation;
}

export const Typography: React.FC<IProps> = props => {
  const {
    theme: { fonts },
  } = useContext(ThemeContext);
  const stylesMap: { [key in StylesTypes]: IStyleTypeProps } = useMemo(
    () => ({
      bigTitle: {
        fontFamily: fonts.bold,
        fontSize: 22,
      },
      midTitle: {
        fontFamily: fonts.bold,
        fontSize: 18,
      },
      smallTitle: {
        fontFamily: fonts.bold,
        fontSize: 15,
      },
      smallTitleR: {
        fontFamily: fonts.regular,
        fontSize: 15,
      },
      buttonText: {
        fontFamily: fonts.medium,
        fontSize: 15,
      },
      commonText: {
        fontFamily: fonts.regular,
        fontSize: 12,
      },
      commonTextBold: {
        fontFamily: fonts.bold,
        fontSize: 12,
      },
      smallText: {
        fontFamily: fonts.regular,
        fontSize: 10,
      },
      smallTextBold: {
        fontFamily: fonts.bold,
        fontSize: 10,
      },
      link: {
        fontFamily: fonts.medium,
        fontSize: 12,
      },
    }),
    [fonts],
  );
  const autoEscape = props.autoEscape;
  const highlightStyle = props.highlightStyle;
  const searchWords = props?.searchWords || [];
  const textToHighlight = String(props.children);
  const chunks = findAll({
    textToHighlight,
    searchWords,
    sanitize: undefined,
    autoEscape,
  });
  const defaultStyle = stylesMap[props.type];
  const incomingStyle = Array.isArray(props.style)
    ? props.style
    : [props.style];
  return (
    <Animated.Text
      {...props}
      allowFontScaling={false}
      style={[
        defaultStyle,
        ...incomingStyle,
        props.animationValue ? { fontSize: props.animationValue } : {},
      ]}>
      {chunks.map((chunk: Chunk, index: number) => {
        const text = textToHighlight?.substr(
          chunk.start,
          chunk.end - chunk.start,
        );

        return !chunk.highlight ? (
          text
        ) : (
          <Animated.Text
            onPress={() => props.highlightClick && props.highlightClick(text)}
            key={index}
            style={[
              chunk.highlight && highlightStyle,
              props.animationValue ? { fontSize: props.animationValue } : {},
            ]}>
            {text}
          </Animated.Text>
        );
      })}
    </Animated.Text>
  );
};
