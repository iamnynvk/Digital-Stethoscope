import {StyleSheet} from 'react-native';
import {
  borderColor,
  inputLabelColor,
  textColorBlack,
  textColorWhite,
  whiteColor,
} from '@/theme/colors';
import {FONT_MEDIUM, FONT_REGULAR} from '@/theme/typography';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import {isAndroid} from '@/utils/platform';
import {screenHorizontalSpace, screenWidth} from '@/theme/spacing';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
  },
  scaffold: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  scrollItemWrapper: {
    paddingHorizontal: screenHorizontalSpace,
  },
  curveBackground: {
    position: 'absolute',
  },
  backArrow: {
    marginTop: isAndroid ? 0 : getStatusBarHeight(),
    marginHorizontal: 0,
  },
  headerTitle: {
    color: textColorWhite,
  },
  userImage: {
    height: screenWidth * 0.4,
    width: screenWidth * 0.4,
    borderRadius: screenWidth,
    borderWidth: 2,
    borderColor: whiteColor,
    alignSelf: 'center',
    marginTop: 20,
  },
  userImageTitle: {
    height: screenWidth * 0.4,
    width: screenWidth * 0.4,
    borderRadius: screenWidth,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 20,
    borderColor: borderColor,
    backgroundColor: whiteColor,
  },
  userName: {
    ...FONT_MEDIUM,
    ...{
      color: textColorBlack,
      fontSize: 26,
      textAlign: 'center',
      marginTop: 12,
      textTransform: 'capitalize',
    },
  },
  userEmail: {
    ...FONT_REGULAR,
    ...{
      color: textColorBlack,
      fontSize: 16,
      textAlign: 'center',
    },
  },
  inputLabel: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 14,
      color: inputLabelColor,
      marginBottom: 3,
      marginTop: 20,
    },
  },
});
