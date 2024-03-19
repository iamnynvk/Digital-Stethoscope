import React from 'react';
import {SafeAreaView, View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

/**
 * Wrapper component for each screen of the app, for consistent look-and-feel.
 *
 * @prop children - Components to render inside the screen.
 * @prop [style] - Additional style for the SafeAreaView.
 */

export const Screen = ({children, style}) => {
  return (
    <SafeAreaView style={[styles.screen, style]}>
      <View style={[styles.view, style]}>{children}</View>
    </SafeAreaView>
  );
};

Screen.propTypes = {
  style: PropTypes.any,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
};
