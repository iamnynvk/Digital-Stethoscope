import {StyleSheet} from 'react-native';
import {screenHorizontalSpace} from '@/theme/spacing';
import {FONT_MEDIUM, FONT_REGULAR} from '@/theme/typography';
import {isAndroid} from '@/utils/platform';
import {
  audioListBorderColor,
  borderColor,
  primaryBgColor,
  textColorBlack,
  textColorPrimary,
  textColorWhite,
  whiteColor,
} from '@/theme/colors';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from '@/theme/scaling';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryBgColor,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: primaryBgColor,
    alignItems: 'center',
    paddingStart: moderateScale(5),
    paddingEnd: moderateScale(20),
    marginTop: isAndroid ? moderateVerticalScale(9) : 0,
  },
  headerText: {
    ...FONT_REGULAR,
    ...{
      color: textColorWhite,
      fontSize: moderateScale(26, 0.1),
      textAlign: 'center',
      marginStart: moderateScale(15),
    },
  },
  backArrow: {
    paddingStart: moderateScale(14),
  },
  fileListSection: {
    flex: 1,
    marginTop: verticalScale(16),
    backgroundColor: whiteColor,
    borderTopStartRadius: moderateScale(26, 0.2),
    borderTopEndRadius: moderateScale(26, 0.2),
    overflow: 'hidden',
  },
  footerBtnContainer: {
    position: 'absolute',
    bottom: moderateVerticalScale(20, 0.2),
    end: moderateVerticalScale(20, 0.2),
  },
  flexOne: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: moderateVerticalScale(14, 0.2),
    paddingTop: moderateVerticalScale(14, 0.2),
    flexGrow: 1,
  },
  shimSectionHeader: {
    width: 90,
    borderRadius: 5,
    height: 16,
    marginHorizontal: 20,
    marginTop: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    ...FONT_MEDIUM,
    ...{
      paddingTop: moderateVerticalScale(12, 0.2),
      paddingBottom: moderateVerticalScale(12, 0.2),
      paddingHorizontal: 30,
      fontSize: moderateScale(14, 0.1),
      color: textColorBlack,
      backgroundColor: whiteColor,
    },
  },
  separator: {
    backgroundColor: audioListBorderColor,
    marginTop: moderateVerticalScale(14),
    marginHorizontal: screenHorizontalSpace,
  },
  viewAllButtonContainer: {
    position: 'absolute',
    right: moderateScale(20, 0.3),
    top: moderateVerticalScale(124, 0.4),
    zIndex: 1,
  },
  viewAllText: {
    ...FONT_MEDIUM,
    ...{
      color: textColorPrimary,
      fontSize: moderateScale(14, 0.2),
    },
  },
  dateContainer: {
    flexDirection: 'row',
    marginHorizontal: screenHorizontalSpace,
  },
  dateLabel: {
    ...FONT_MEDIUM,
    ...{
      fontSize: moderateScale(14, 0.2),
      color: textColorPrimary,
    },
  },
  dateBoxContainer: {
    borderColor: borderColor,
    borderWidth: 1,
    height: moderateVerticalScale(44, 0.3),
    justifyContent: 'center',
    paddingStart: moderateScale(12, 0.2),
    marginTop: moderateVerticalScale(2),
  },
  dateText: {
    ...FONT_MEDIUM,
  },
});
