import React from 'react';
import {ActivityIndicator, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {whiteColor} from '@/theme/colors';

/**
 * Renders a loading indicator - a faint circle and a bold
 * quarter of a circle spinning around it.
 *
 * @prop [size] - Diameter of the indicator in value of small or large.
 * @prop [color] - The color of the circle.
 * @prop [containerStyle] - Style object applied to the outermost component.
 */

export const Loading = ({size, color, containerStyle}) => (
  <View style={[styles.rootStyle, containerStyle]}>
    <ActivityIndicator size={size} color={color} />
  </View>
);

Loading.defaultProps = {
  size: 'small',
  color: whiteColor,
};

Loading.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
  containerStyle: PropTypes.oneOfType([PropTypes.object, ViewPropTypes.style]),
};
