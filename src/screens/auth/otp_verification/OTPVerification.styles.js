import {StyleSheet} from 'react-native';
import {
  borderColor,
  inputBorderColor,
  inputLabelColor,
  textColorBlack,
  textColorPrimary,
} from '@/theme/colors';
import {FONT_MEDIUM, FONT_SEMI_BOLD} from '@/theme/typography';
import {screenHeight} from '@/theme/spacing';

export const styles = StyleSheet.create({
  headerText: {
    ...FONT_SEMI_BOLD,
    ...{
      color: textColorBlack,
      fontSize: 26,
      marginTop: screenHeight * 0.04,
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
  phoneNoText: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 26,
      marginTop: 26,
    },
  },
  image: {
    alignSelf: 'center',
  },
  inputLabel: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 14,
      color: inputLabelColor,
      marginBottom: 8,
    },
  },
  otpInput: {
    height: 50,
  },
  inputFieldStyle: {
    ...FONT_MEDIUM,
    ...{
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: borderColor,
      color: textColorBlack,
      fontSize: 20,
    },
  },
  inputFieldHighLighted: {
    borderColor: inputBorderColor,
  },
  footer: {
    flexDirection: 'row',
    //justifyContent: 'center',
    //alignItems: 'center',
    flexWrap: 'wrap',
  },
  footerNoteText: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 16,
    },
  },
  sendAgainButtonText: {
    ...FONT_MEDIUM,
    ...{
      color: textColorPrimary,
    },
  },
});
