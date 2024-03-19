import {Platform} from 'react-native';

/**
 * Determines if device is iphone/ios or android.
 *
 * @export
 * @return {boolean}
 */

export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';
