import {StyleSheet} from 'react-native';
import {
  audioListBorderColor,
  blackColor,
  textColorBlack,
  whiteColor,
} from '@/theme/colors';
import {screenHorizontalSpace} from '@/theme/spacing';
import {FONT_MEDIUM, FONT_REGULAR} from '@/theme/typography';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from '@/theme/scaling';

export const styles = StyleSheet.create({
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: screenHorizontalSpace,
    marginTop: moderateVerticalScale(26),
  },
  userImage: {
    width: moderateScale(60, 0.2),
    height: moderateScale(60, 0.2),
    borderRadius: moderateScale(60),
    borderWidth: 2,
    borderColor: whiteColor,
    marginEnd: 17,
  },
  userImageTitle: {
    width: moderateScale(60, 0.2),
    height: moderateScale(60, 0.2),
    marginEnd: 17,
    borderColor: blackColor,
    borderRadius: moderateScale(60),
  },
  shimUserName: {
    width: moderateScale(66, 0.2),
    borderRadius: scale(5),
    height: verticalScale(16),
  },
  userName: {
    ...FONT_MEDIUM,
    ...{
      color: textColorBlack,
      fontSize: moderateScale(16, 0.2),
      textTransform: 'capitalize',
    },
  },
  shimUserEmail: {
    width: moderateScale(160, 0.3),
    borderRadius: scale(5),
    height: verticalScale(16),
    marginTop: moderateVerticalScale(8, 0.2),
  },
  userEmail: {
    ...FONT_REGULAR,
    ...{
      color: textColorBlack,
      fontSize: moderateScale(14, 0.2),
    },
  },
  separator: {
    backgroundColor: audioListBorderColor,
    marginTop: moderateVerticalScale(14),
    marginHorizontal: screenHorizontalSpace,
  },
  flexOne: {
    flex: 1,
  },
});

export default styles;
