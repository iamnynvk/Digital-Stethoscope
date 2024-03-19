import {StyleSheet} from 'react-native';
import {screenHorizontalSpace} from '@/theme/spacing';
import {isAndroid} from '@/utils/platform';
import {FONT_MEDIUM} from '@/theme/typography';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    marginHorizontal: screenHorizontalSpace,
  },
  backButtonIcon: {
    width: 30,
  },
  titleWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    top: isAndroid ? 5 : 0,
    bottom: 0,
    zIndex: -1,
  },
  title: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 26,
      textTransform: 'capitalize',
    },
  },
});

export default styles;
