import {StyleSheet} from 'react-native';
import {toastBorderColor} from '@/theme/colors';
import {FONT_REGULAR} from '@/theme/typography';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  toastStyle: {
    borderLeftColor: toastBorderColor,
  },
  textStyle: {
    ...FONT_REGULAR,
    ...{
      fontSize: 14,
    },
  },
  iconStyle: {
    opacity: 0,
  },
});

export default styles;
