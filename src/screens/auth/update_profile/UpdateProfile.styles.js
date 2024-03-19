import {StyleSheet} from 'react-native';
import {FONT_MEDIUM, FONT_SEMI_BOLD} from '@/theme/typography';
import {
  borderColor,
  inputDisabledTextColor,
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
  backButton: {
    marginStart: 0,
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
  memberListStyle: {
    borderRadius: 4,
  },
  memberListItem: {
    backgroundColor: listItemBgColor,
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberImage: {
    borderColor: borderColor,
    borderWidth: 1,
    borderRadius: 53 / 2,
    marginStart: 15,
    marginVertical: 10,
  },
  memberInfoText: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 14,
      marginStart: 8,
    },
  },
  removeMemberIcon: {
    marginStart: 10,
    marginEnd: 31,
  },
  disableTextInputStyle: {
    color: inputDisabledTextColor,
  },
});
