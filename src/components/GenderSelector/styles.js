import {StyleSheet} from 'react-native';
import {FONT_MEDIUM} from '@/theme/typography';
import {
  borderColor,
  inputLabelColor,
  primaryBgColor,
  textColorPrimary,
  textColorWhite,
  whiteColor,
} from '@/theme/colors';

const styles = StyleSheet.create({
  inputLabel: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 14,
      color: inputLabelColor,
      marginBottom: 3,
    },
  },
  genderButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    width: '30%',
    height: 44,
    borderRadius: 4,
    backgroundColor: whiteColor,
    borderColor: borderColor,
    borderWidth: 1,
  },
  genderButtonHighlighted: {
    width: '30%',
    height: 44,
    borderRadius: 4,
    backgroundColor: primaryBgColor,
  },
  genderButtonText: {
    color: textColorPrimary,
  },
  genderButtonHighlightedText: {
    color: textColorWhite,
  },
});

export default styles;
