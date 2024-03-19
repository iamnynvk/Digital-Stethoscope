import {StyleSheet} from 'react-native';
import {textColorWhite, whiteColor} from '@/theme/colors';
import {FONT_MEDIUM} from '@/theme/typography';
import {moderateScale, scale} from '@/theme/scaling';

const styles = StyleSheet.create({
  image: {
    height: moderateScale(62, 0.2),
    width: moderateScale(62, 0.2),
    borderRadius: moderateScale(62),
  },
  shimUserImage: {
    width: moderateScale(62, 0.2),
    height: moderateScale(62, 0.2),
    borderRadius: moderateScale(62),
    justifyContent: 'center',
  },
  textContainer: {
    height: moderateScale(62, 0.2),
    width: moderateScale(62, 0.2),
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: whiteColor,
    borderWidth: moderateScale(1),
    borderRadius: moderateScale(62, 0.2),
  },
  text: {
    ...FONT_MEDIUM,
    ...{
      color: textColorWhite,
      fontSize: moderateScale(16, 0.2),
      textTransform: 'uppercase',
    },
  },
});

export default styles;
