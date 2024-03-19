import {StyleSheet} from 'react-native';
import {FONT_REGULAR} from '@/theme/typography';
import {
  audioListBorderColor,
  textColorBlack,
  textColorPrimary,
} from '@/theme/colors';
import {
  moderateScale,
  moderateVerticalScale,
  scale,
  verticalScale,
} from '@/theme/scaling';

export const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: moderateScale(1),
    borderColor: audioListBorderColor,
    borderRadius: moderateScale(4),
    paddingVertical: moderateVerticalScale(16, 0.1),
    marginHorizontal: moderateScale(20, 0.2),
  },
  shimIcon: {
    width: moderateScale(50, 0.4),
    height: moderateScale(50, 0.4),
    borderRadius: moderateScale(50),
    justifyContent: 'center',
    marginStart: scale(9),
    marginEnd: moderateScale(12),
  },
  pulseIcon: {
    marginStart: moderateScale(9),
    marginEnd: moderateScale(12),
  },
  playIcon: {
    marginStart: moderateScale(22),
  },
  shimTitle: {
    width: scale(120),
    borderRadius: scale(5),
    height: verticalScale(16),
  },
  fileTitle: {
    ...FONT_REGULAR,
    ...{
      color: textColorBlack,
    },
  },
  shimDuration: {
    width: scale(60),
    borderRadius: scale(5),
    height: verticalScale(16),
    marginTop: moderateVerticalScale(9, 0.2),
  },
  fileDuration: {
    ...FONT_REGULAR,
    ...{
      fontSize: moderateScale(14, 0.2),
      color: textColorPrimary,
    },
  },
  waveform: {
    borderColor: audioListBorderColor,
    borderWidth: 1,
    marginHorizontal: moderateScale(21, 0.2),
  },
  flexOne: {
    flex: 1,
  },
});

export default styles;
