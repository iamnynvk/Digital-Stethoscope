import {StyleSheet} from 'react-native';
import {FONT_MEDIUM} from '@/theme/typography';
import {isAndroid} from '@/utils/platform';
import {
  inputBorderColor,
  inputFocusedBorderColor,
  inputLabelColor,
  inputTextColor,
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
  inputWrapper: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
  },
  input: {
    ...FONT_MEDIUM,
    ...{
      color: inputTextColor,
      flex: 1,
      paddingVertical: isAndroid ? 12 : 14,
      fontSize: 14,
    },
  },
  borderStyleBase: {
    borderColor: inputBorderColor,
  },
  borderStyleHighLighted: {
    borderColor: inputFocusedBorderColor,
  },
});

export default styles;
