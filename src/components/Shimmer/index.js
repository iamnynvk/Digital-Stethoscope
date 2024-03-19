import React from 'react';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {gradientShimmer} from '@/theme/colors';
import {ViewPropTypes} from 'react-native';

const ShimmerPlaceHolder = createShimmerPlaceholder(LinearGradient);

/**
 * To create ShimmerPlaceholder by Linear Gradient.
 *
 * @prop [style] - Container Style.
 * @prop children - Components to render inside the shimmer.
 * @prop isVisible - Visible child components.
 * @prop isActive - Stop running shimmer animation at beginning.
 */
export const Shimmer = ({style, children, isVisible, isActive}) => {
  return (
    <ShimmerPlaceHolder
      style={style}
      stopAutoRun={!isActive}
      visible={isVisible}
      duration={2000}
      shimmerColors={gradientShimmer}>
      {children}
    </ShimmerPlaceHolder>
  );
};

Shimmer.defaultProps = {
  isVisible: false,
  isActive: true,
  secondary: false,
  progress: false,
};

Shimmer.propTypes = {
  style: ViewPropTypes.style,
  children: PropTypes.any,
  isVisible: PropTypes.bool,
  isActive: PropTypes.bool,
};
