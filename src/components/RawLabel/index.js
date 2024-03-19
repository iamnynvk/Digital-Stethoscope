import React from 'react';
import {Text} from 'react-native';
import invariant from 'invariant';
import {textColorBlack} from '@/theme/colors';

/**
 * A thin wrapper for `Text` that ensures a consistent, themed style.
 * Pass either `text` or `children`, but not both.
 *
 * @prop text - Contents for Text.
 * @prop [style] - Can override our default style for this component.
 * @prop ...all other Text props - Passed through verbatim to Text.
 */

export const RawLabel = props => {
  const {text, children, style, ...restProps} = props;

  invariant(
    text != null || children != null,
    'RawLabel: `text` or `children` should be non-nullish',
  );
  invariant(
    text == null || children == null,
    'RawLabel: `text` or `children` should be nullish',
  );

  const defaultStyle = {
    fontSize: 15,
    color: textColorBlack,
  };

  return (
    <Text style={[defaultStyle, style]} allowFontScaling={false} {...restProps}>
      {text}
      {children}
    </Text>
  );
};
