import {StyleSheet} from 'react-native';
import {recordAudioScreenBgColor} from '@/theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: recordAudioScreenBgColor,
  },
  scaffold: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 50,
  },
  imageMapperContainer: {
    flex: 1,
    backgroundColor: recordAudioScreenBgColor,
    marginTop: 24,
    alignSelf: 'center',
  },
});
