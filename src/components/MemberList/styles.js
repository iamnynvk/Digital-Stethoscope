import {StyleSheet} from 'react-native';
import {
  borderColor,
  listItemBgColor,
  textColorBlack,
  whiteColor,
} from '@/theme/colors';
import {FONT_MEDIUM} from '@/theme/typography';
import {moderateScale} from '@/theme/scaling';

const styles = StyleSheet.create({
  container: {
    backgroundColor: listItemBgColor,
  },
  memberListItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberImage: {
    height: moderateScale(53),
    width: moderateScale(53),
    borderColor: borderColor,
    borderWidth: 1,
    borderRadius: moderateScale(53),
    marginStart: 15,
    marginVertical: 10,
  },
  title: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 14,
      marginStart: 8,
      textTransform: 'capitalize',
    },
  },
  email: {
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
  separator: {
    marginHorizontal: 15,
  },
  flexOne: {
    flex: 1,
  },
  userName: {
    ...FONT_MEDIUM,
    ...{
      color: textColorBlack,
      fontSize: 16,
      textAlign: 'center',
      textTransform: 'capitalize',
    },
  },
  userImageTitle: {
    height: 53,
    width: 53,
    borderWidth: 1,
    borderColor: borderColor,
    backgroundColor: whiteColor,
    borderWidth: 1,
    borderRadius: 53 / 2,
    marginStart: 15,
    marginVertical: 10,
  },
});

export default styles;
