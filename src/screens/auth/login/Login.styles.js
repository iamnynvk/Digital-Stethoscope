import {StyleSheet} from 'react-native';
import {textColorBlack, textColorPrimary} from '@/theme/colors';
import {screenHeight} from '@/theme/spacing';
import {FONT_MEDIUM, FONT_REGULAR, FONT_SEMI_BOLD} from '@/theme/typography';
import {isAndroid} from '@/utils/platform';

export const styles = StyleSheet.create({
  screenBackground: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
  },
  headerText: {
    ...FONT_SEMI_BOLD,
    ...{
      color: textColorBlack,
      fontSize: 26,
      textAlign: 'center',
    },
  },
  subHeaderText: {
    ...FONT_MEDIUM,
    ...{
      color: textColorBlack,
      fontSize: 16,
      textAlign: 'center',
    },
  },
  image: {
    alignSelf: 'center',
  },
  appTitleImage: {
    height: screenHeight * 0.06,
    marginTop: isAndroid ? screenHeight * 0.04 : 42,
  },
  webLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
