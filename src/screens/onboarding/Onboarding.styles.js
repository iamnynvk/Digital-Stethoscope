import {
  sliderHeaderTextColor,
  textColorPrimary,
  textColorRed,
} from '@/theme/colors';
import {FONT_MEDIUM, FONT_REGULAR} from '@/theme/typography';
import {isAndroid} from '@/utils/platform';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
  sliderPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    ...FONT_MEDIUM,
    ...{
      color: sliderHeaderTextColor,
      fontSize: 22,
      textAlign: 'center',
      marginTop: isAndroid ? 12 : 44,
    },
  },
  messageText: {
    ...FONT_REGULAR,
    ...{
      color: textColorPrimary,
      fontSize: 16,
      lineHeight: 20,
      textAlign: 'center',
      marginTop: isAndroid ? 3 : 8,
      marginHorizontal: isAndroid ? 20 : 37,
    },
  },
  textButtonContainer: {
    alignSelf: 'flex-end',
    marginHorizontal: 30,
    marginTop: isAndroid ? 3 : 16,
  },
  textButtonStyle: {
    ...FONT_MEDIUM,
    ...{
      color: textColorRed,
      fontSize: 18,
    },
  },
  footerTextButtonContainer: {
    flexDirection: 'row',
  },
  flexOne: {
    flex: 1,
  },
});
