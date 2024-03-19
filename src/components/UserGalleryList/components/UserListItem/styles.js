import {StyleSheet} from 'react-native';
import {textColorWhite, whiteColor} from '@/theme/colors';
import {FONT_MEDIUM} from '@/theme/typography';
import {moderateScale, moderateVerticalScale} from '@/theme/scaling';

export default StyleSheet.create({
  container: {
    marginEnd: moderateScale(24, 0.2),
  },
  viewWrapper: {
    alignItems: 'center',
  },
  imageBorder: {
    borderWidth: moderateScale(1),
    borderColor: whiteColor,
  },
  title: {
    ...FONT_MEDIUM,
    ...{
      alignSelf: 'center',
      fontSize: moderateScale(12, 0.2),
      color: textColorWhite,
      marginTop: moderateScale(5, 0.2),
      textTransform: 'capitalize',
    },
  },
  shimeTitle: {
    width: moderateScale(50, 0.2),
    borderRadius: moderateScale(5, 0.3),
    height: moderateVerticalScale(12),
    alignSelf: 'center',
    marginTop: moderateScale(9, 0.2),
  },
});
