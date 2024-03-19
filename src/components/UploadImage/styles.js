import {StyleSheet} from 'react-native';
import {borderColor, textColorWhite} from '@/theme/colors';
import {FONT_MEDIUM} from '@/theme/typography';
import {screenWidth} from '@/theme/spacing';

const styles = StyleSheet.create({
  userImageContainer: {
    borderRadius: 100,
    borderWidth: 0.8,
    alignSelf: 'center',
    marginTop: 35,
    borderColor: borderColor,
  },
  userImage: {
    width: screenWidth * 0.36,
    height: screenWidth * 0.36,
    borderRadius: screenWidth,
  },
  chooseImageStyle: {
    position: 'absolute',
    right: -5,
    bottom: -5,
    zIndex: 1,
  },
  imageOverlay: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: screenWidth * 0.36,
    height: screenWidth * 0.36,
    borderRadius: screenWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 18,
      color: textColorWhite,
      //marginTop: 16,
      alignSelf: 'center',
    },
  },
});

export default styles;
