import {Dimensions} from 'react-native';
import {isTablet} from 'react-native-device-detection';

const {width, height} = Dimensions.get('window');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 350;
const guidelineBaseHeight = 680;

//With tablet condition
export const scale = size => {
  if (isTablet) return (shortDimension / guidelineBaseWidth) * size;
  return size;
};

export const moderateScale = (size, factor = 0.5) => {
  if (isTablet) return size + (scale(size) - size) * factor;
  return size;
};

export const verticalScale = size => {
  if (isTablet) return (longDimension / guidelineBaseHeight) * size;
  return size;
};

export const moderateVerticalScale = (size, factor = 0.5) => {
  if (isTablet) return size + (verticalScale(size) - size) * factor;
  return size;
};
