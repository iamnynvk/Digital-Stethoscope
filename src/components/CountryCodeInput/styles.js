import {StyleSheet} from 'react-native';
import {FONT_MEDIUM} from '@/theme/typography';
import {inputBorderColor, inputLabelColor} from '@/theme/colors';

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 4,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: inputBorderColor,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeText: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 14,
      marginStart: 15,
    },
  },
  icon: {
    marginEnd: 8,
  },
  viewLine: {
    width: 0.5,
    backgroundColor: inputBorderColor,
    height: 40,
  },
  inputStyle: {
    flex: 1,
  },
  inputWrapper: {
    borderWidth: 0,
    paddingStart: 3,
  },
  inputLabel: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 14,
      color: inputLabelColor,
      marginStart: 2,
      marginBottom: 3,
    },
  },
});

export default styles;
