import {StyleSheet} from 'react-native';
import {primaryBgColor, textColorWhite} from '@/theme/colors';
import {FONT_REGULAR} from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: primaryBgColor,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: primaryBgColor,
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 55,
  },
  headerText: {
    ...FONT_REGULAR,
    ...{
      color: textColorWhite,
      fontSize: 26,
      textAlign: 'center',
      marginStart: 15,
    },
  },
  map: {
    position: 'absolute',
    top: 55,
    bottom: 0,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    position: 'absolute',
    top: '50%',
    zIndex: 1,
  },
  marker: {
    height: 45,
    width: 45,
  },
  flexOne: {
    flex: 1,
  },
});
