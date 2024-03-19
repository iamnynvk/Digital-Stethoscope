import {StyleSheet} from 'react-native';
import {FONT_REGULAR, FONT_MEDIUM} from '@/theme/typography';
import {textColorBlack, textColorWhite} from '@/theme/colors';
import {screenHorizontalSpace} from '@/theme/spacing';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 20,
      paddingBottom: 10,
      color: textColorBlack,
      marginTop: 10,
    },
  },
  subtitle: {
    fontSize: 20,
    color: textColorBlack,
  },
  error: {
    ...FONT_REGULAR,
    ...{
      paddingTop: 10,
      paddingBottom: 16,
      marginHorizontal: screenHorizontalSpace,
    },
  },
  button: {
    backgroundColor: '#80D4C4',
    borderRadius: 50,
    paddingVertical: 16,
    width: 112,
  },
  buttonText: {
    ...FONT_REGULAR,
    ...{
      color: textColorWhite,
      textAlign: 'center',
    },
  },
});

export default styles;
