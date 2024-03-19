import {textColorBlack} from './colors';
import {moderateScale} from './scaling';

// FONT FAMILY
export const FONT_FAMILY_REGULAR = 'Poppins-Regular';
export const FONT_FAMILY_MEDIUM = 'Poppins-Medium';
export const FONT_FAMILY_SEMI_BOLD = 'Poppins-SemiBold';
export const FONT_FAMILY_BOLD = 'Poppins-Bold';

// FONT WEIGHT
export const FONT_WEIGHT_REGULAR = '400';
export const FONT_WEIGHT_BOLD = '700';

export const extraLargeFontSize = 32;
export const largeFontSize = 24;
export const buttonFontSize = 18;
export const baseFontSize = 16;
export const smallFontSize = 14;
export const smallestFontSize = 10;
export const largeHeaderFontSize = 20;
export const headerFontSize = 18;

// LINE HEIGHT
export const LINE_HEIGHT_24 = 24;
export const LINE_HEIGHT_20 = 20;
export const LINE_HEIGHT_16 = 16;

// FONT STYLE
export const FONT_REGULAR = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontSize: moderateScale(16, 0.2),
  color: textColorBlack,
};

export const FONT_MEDIUM = {
  fontFamily: FONT_FAMILY_MEDIUM,
  fontSize: moderateScale(16, 0.2),
  color: textColorBlack,
};

export const FONT_SEMI_BOLD = {
  fontFamily: FONT_FAMILY_SEMI_BOLD,
  fontSize: moderateScale(16, 0.2),
  color: textColorBlack,
};

export const FONT_BOLD = {
  fontFamily: FONT_FAMILY_BOLD,
  fontSize: moderateScale(16, 0.2),
  color: textColorBlack,
};
