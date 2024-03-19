import React from 'react';
import {TouchableHighlight, View} from 'react-native';
import PropTypes from 'prop-types';

/**
 * Make a child component respond properly to touches, on both platforms.
 *
 * @prop [style] - Style for the touch target / feedback area.
 * @prop [children] - A single component (not zero, or more than one.)
 * @prop [onPress] - Passed through; see upstream docs.
 * @prop [onLongPress] - Passed through; see upstream docs.
 */

export const Touchable = props => {
  const {accessibilityLabel, style, onPress, onLongPress, ...otherProps} =
    props;

  if (!onPress && !onLongPress) {
    return (
      <View
        accessible={!!accessibilityLabel}
        accessibilityLabel={accessibilityLabel}
        style={style}>
        {props.children}
      </View>
    );
  }

  return (
    <TouchableHighlight
      accessibilityLabel={accessibilityLabel}
      underlayColor={'transparent'}
      style={style}
      onPress={onPress}
      onLongPress={onLongPress}
      {...otherProps}>
      {props.children}
    </TouchableHighlight>
  );
};

Touchable.propTypes = {
  accessibilityLabel: PropTypes.string,
  children: PropTypes.any,
  style: PropTypes.any,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
};
