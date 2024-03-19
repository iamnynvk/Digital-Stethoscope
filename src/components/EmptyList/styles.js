import {StyleSheet} from 'react-native';
import {FONT_MEDIUM} from '@/theme/typography';
import {textColorGray} from '@/theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    ...FONT_MEDIUM,
    ...{
      textAlign: 'center',
      color: textColorGray,
    },
  },
  image: {
    height: 140,
    opacity: 0.5,
  },
});

export default styles;
