import {Dimensions, StyleSheet} from 'react-native';
import {
  blackColor,
  primaryBgColor,
  textColorBlack,
  textColorPrimary,
  whiteColor,
} from '@/theme/colors';
import {FONT_REGULAR, FONT_SEMI_BOLD} from '@/theme/typography';

const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  mainView: {
    // height: windowHeight * 0.52,
    height: windowHeight * 0.57,
    backgroundColor: whiteColor,
  },
  childView: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  container: {
    backgroundColor: whiteColor,
  },
  headerText: {
    ...FONT_SEMI_BOLD,
    ...{
      color: textColorBlack,
      fontSize: 26,
      marginTop: 12,
    },
  },
  header: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: primaryBgColor,
    marginTop: 30,
  },
  backButton: {
    marginStart: 0,
  },
  headerOpen: {
    backgroundColor: whiteColor,
    shadowColor: '#333333',
    shadowOpacity: {
      width: -1,
      height: -3,
    },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pannelHandle: {
    width: 40,
    height: 5,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 20,
  },
  textMainView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5,
    marginTop: 5,
    marginHorizontal: 10,
  },
  pannelHeader: {
    alignItems: 'center',
  },
  headerTitle: {
    ...FONT_SEMI_BOLD,
    fontSize: 22,
    justifyContent: 'center',
  },
  textDecor: {
    color: primaryBgColor,
    ...FONT_SEMI_BOLD,
    fontSize: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textDecorGain: {
    color: primaryBgColor,
    borderBottomColor: blackColor,
    alignItems: 'center',
    justifyContent: 'center',
    ...FONT_SEMI_BOLD,
    fontSize: 30,
  },
  listStyles: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: blackColor,
    marginVertical: 10,
  },
  childText: {
    justifyContent: 'center',
    alignContent: 'center',
    marginStart: 15,
  },
  itemRender: {
    ...FONT_REGULAR,
    fontSize: 28,
  },
  textDesign: {
    ...FONT_REGULAR,
    fontSize: 15,
    color: textColorPrimary,
  },
});
