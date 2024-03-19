import React from 'react';
import {KeyboardAvoidingView, View} from 'react-native';
import PropTypes from 'prop-types';
import {getBottomSpace, isIphoneX} from 'react-native-iphone-x-helper';
import {isAndroid, isIOS} from '@/utils/platform';

/**
 * Renders RN's `KeyboardAvoidingView` on iOS, `View` on Android.
 */

const keyboardOffset = isIphoneX() ? 12 + getBottomSpace() : 20;

const defaultAvoid = isIOS
  ? {
      behavior: 'padding',
      keyboardVerticalOffset: 0,
    }
  : {};

const avoidWithHeader = isIOS
  ? {
      behavior: 'padding',
      keyboardVerticalOffset: keyboardOffset,
    }
  : {};

export const KeyboardAvoider = props => {
  const {withHeader, children, style, contentContainerStyle, ...restProps} =
    props;

  /**
   * On Android this view has no functionality because it is provided by the OS
   * already. We enabled this by setting android:windowSoftInputMode="adjustResize"
   * in AndroidManifest.xml.
   */
  if (isAndroid) {
    return <View style={style}>{children}</View>;
  }

  const keyboardAvoidingProps = withHeader ? avoidWithHeader : defaultAvoid;

  return (
    <KeyboardAvoidingView
      style={style}
      contentContainerStyle={contentContainerStyle}
      {...keyboardAvoidingProps}
      {...restProps}>
      {children}
    </KeyboardAvoidingView>
  );
};

KeyboardAvoider.defaultProps = {
  withHeader: true,
};

KeyboardAvoider.propTypes = {
  withHeader: PropTypes.bool,
  children: PropTypes.any,
  style: PropTypes.any,
  contentContainerStyle: PropTypes.any,
};
