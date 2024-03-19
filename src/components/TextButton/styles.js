import {StyleSheet} from 'react-native';
import {textColorBlack} from '@/theme/colors';

const styles = StyleSheet.create({
  touchable: {
    alignSelf: 'flex-start',
  },
  leftMargin: {
    marginLeft: 8,
  },
  rightMargin: {
    marginRight: 8,
  },
  text: {
    color: textColorBlack,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default styles;
