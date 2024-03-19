import {StyleSheet} from 'react-native';
import {screenHorizontalSpace} from '@/theme/spacing';

const styles = StyleSheet.create({
  formContent: {
    flex: 1,
    paddingHorizontal: screenHorizontalSpace,
  },
  scrollView: {
    paddingTop: 12,
    flexGrow: 1,
  },
});

export default styles;
