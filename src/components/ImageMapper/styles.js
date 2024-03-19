import {StyleSheet} from 'react-native';
import {whiteColor} from '@/theme/colors';
import {screenWidth} from '@/theme/spacing';
import {moderateScale} from '@/theme/scaling';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: whiteColor,
    width: moderateScale(300),
    alignSelf: 'center',
  },
});

export default styles;
