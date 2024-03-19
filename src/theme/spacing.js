import {Dimensions} from 'react-native';
import {isAndroid} from '@/utils/platform';
import {moderateScale} from './scaling';

const {width, height} = Dimensions.get('window');

export const hairline = 1;
export const tiny = 3;
export const smallest = 4;
export const smaller = 8;
export const small = 12;
export const base = 16;
export const large = 20;
export const larger = 24;
export const largest = 28;
export const extraLarge = 50;

export const screenWidth = width < height ? width : height;
export const screenHeight = width < height ? height : width;
export const screenHorizontalSpace = isAndroid ? moderateScale(18) : 26;
export const baseBorderWidth = 1;
export const inputBorderRadius = 10;
export const baseButtonHeight = 53;
export const sectionPadding = small;
