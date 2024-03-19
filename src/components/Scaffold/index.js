import React from 'react';
import {ScrollView} from 'react-native';
import PropTypes from 'prop-types';
import {KeyboardAvoider} from '../KeyboardAvoider';
import styles from './styles';

/**
 * A scaffold component that is provides scrollable view.
 *
 * @prop [wrapperStyle] - Style object applied to the outermost component.
 * @prop [scrollContainerStyle] - Style object applied to the scrollview component.
 * @prop [children] - A single component (not zero, or more than one.)
 */

export const Scaffold = props => {
  const {wrapperStyle, children, scrollContainerStyle} = props;
  return (
    <KeyboardAvoider style={wrapperStyle || styles.formContent}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.scrollView, scrollContainerStyle]}>
        {children}
      </ScrollView>
    </KeyboardAvoider>
  );
};

Scaffold.propTypes = {
  wrapperStyle: PropTypes.any,
  scrollContainerStyle: PropTypes.any,
  children: PropTypes.any,
};
