import {Platform, StyleSheet} from 'react-native';
import {separatorColor} from '@/theme/colors';

const styles = StyleSheet.create({
  root: {
    height: 1,
    backgroundColor: separatorColor,
    opacity: 0.5,
  },
  shadow: {
    backgroundColor: separatorColor,
    ...Platform.select({
      ios: {
        shadowOpacity: 0.9,
        shadowRadius: 1,
        shadowOffset: {
          height: 0.5,
          width: 0,
        },
      },
      android: {
        elevation: 0.3,
      },
    }),
  },
  opacity: {
    opacity: 0.3,
  },
});

export default styles;
