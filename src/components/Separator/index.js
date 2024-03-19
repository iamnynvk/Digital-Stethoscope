import React from 'react';
import {View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';

/**
 * List item sepator.
 */
export const Separator = ({
  withShadow,
  withOpacity,
  marginVertical,
  marginTop,
  marginBottom,
  style,
}) => (
  <View
    style={[
      styles.root,
      marginVertical && {marginVertical},
      marginTop && {marginTop},
      marginBottom && {marginBottom},
      withShadow && styles.shadow,
      withOpacity && styles.opacity,
      style,
    ]}
  />
);

Separator.propTypes = {
  style: ViewPropTypes.style,
  withShadow: PropTypes.bool,
  withOpacity: PropTypes.bool,
  marginVertical: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
};
