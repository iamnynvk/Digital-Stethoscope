import {StyleSheet} from 'react-native';
import {FONT_MEDIUM, FONT_SEMI_BOLD} from '@/theme/typography';
import {
  borderColor,
  inputLabelColor,
  listItemBgColor,
  primaryBgColor,
  textColorBlack,
  textColorPrimary,
  textColorWhite,
  whiteColor,
} from '@/theme/colors';
import {screenWidth} from '@/theme/spacing';

export const styles = StyleSheet.create({
  headerText: {
    ...FONT_SEMI_BOLD,
    ...{
      color: textColorBlack,
      fontSize: 26,
      marginTop: 12,
    },
  },
  subHeaderText: {
    ...FONT_MEDIUM,
    ...{
      color: textColorBlack,
      fontSize: 16,
      marginTop: 8,
    },
  },
  userImageContainer: {
    borderRadius: 100,
    borderWidth: 0.8,
    alignSelf: 'center',
    marginTop: 35,
    borderColor: borderColor,
  },
  userImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  chooseImageStyle: {
    position: 'absolute',
    right: -5,
    bottom: -5,
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
  locationSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTitle: {
    ...FONT_MEDIUM,
    ...{
      color: textColorPrimary,
      fontSize: 14,
    },
  },
  locationText: {
    ...FONT_MEDIUM,
    ...{
      marginTop: 3,
    },
  },
  chooseLocationContainer: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: borderColor,
  },
  flexOne: {
    flex: 1,
  },
  addMemberWrapper: {
    alignSelf: 'center',
  },
  addMemberTitle: {
    ...FONT_MEDIUM,
    ...{
      color: textColorPrimary,
      fontSize: 18,
    },
  },
});
