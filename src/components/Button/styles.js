import {StyleSheet} from 'react-native';
const {
  borderColor,
  buttonBgColor,
  textColorBlack,
  textColorWhite,
  whiteColor,
} = require('@/theme/colors');
const {baseBorderWidth, baseButtonHeight} = require('@/theme/spacing');
const {FONT_MEDIUM} = require('@/theme/typography');

const styles = StyleSheet.create({
  frame: {
    height: baseButtonHeight,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  primaryFrame: {
    backgroundColor: buttonBgColor,
  },
  secondaryFrame: {
    borderWidth: baseBorderWidth,
    borderColor: borderColor,
  },
  disabledPrimaryFrame: {
    backgroundColor: 'hsla(0, 0%, 50%, 0.4)',
  },
  disabledSecondaryFrame: {
    borderWidth: baseBorderWidth,
    borderColor: 'hsla(0, 0%, 50%, 0.4)',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
  },
  icon: {
    marginRight: 8,
  },
  primaryIcon: {
    color: whiteColor,
  },
  secondaryIcon: {
    color: whiteColor,
  },
  text: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 18,
    },
  },
  primaryText: {
    color: textColorWhite,
  },
  secondaryText: {
    color: textColorBlack,
  },
  disabledText: {
    color: 'hsla(0, 0%, 50%, 0.8)',
  },
});

export default styles;
