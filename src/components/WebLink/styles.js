import {StyleSheet} from 'react-native';
import {textColorPrimary} from '@/theme/colors';
import {FONT_MEDIUM} from '@/theme/typography';

const styles = StyleSheet.create({
  link: {
    ...FONT_MEDIUM,
    ...{
      color: textColorPrimary,
      fontSize: 14,
    },
  },
});

export default styles;
