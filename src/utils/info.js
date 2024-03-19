import {Alert, ToastAndroid} from 'react-native';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import Toast from 'react-native-toast-message';
import {isAndroid} from './platform';

export const showToast = message => {
  if (isAndroid) {
    ToastAndroid.show(message, ToastAndroid.LONG);
  } else {
    Toast.show({
      text1: message,
      topOffset: getStatusBarHeight() + 16,
      visibilityTime: 3000,
    });
  }
};

export const showAsyncAlert = (title, message, buttons, options = {}, type) => {
  return new Promise((resolve, reject) => {
    const interceptCallback = callback => {
      if (!callback) {
        resolve();
      } else {
        try {
          const maybePromise = callback();
          if (maybePromise instanceof Promise) {
            maybePromise.then(resolve, reject);
          } else {
            resolve(maybePromise);
          }
        } catch (e) {
          reject(e);
        }
      }
    };

    const nonEmptyButtons =
      buttons && buttons.length > 0 ? buttons : DefaultRNButtons;

    const interceptedButtons = nonEmptyButtons.map(button => ({
      ...button,
      onPress: () => interceptCallback(button.onPress),
    }));

    const interceptedOptions = {
      ...options,
      onDismiss: () => interceptCallback(options.onDismiss),
    };

    Alert.alert(title, message, interceptedButtons, interceptedOptions, type);
  });
};
