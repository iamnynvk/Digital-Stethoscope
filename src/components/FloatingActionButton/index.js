import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {Touchable} from '../TouchableItem';
import {Loading} from '../Loading';
import {whiteColor} from '@/theme/colors';
import images from '@/assets/images';
import {moderateScale} from '@/theme/scaling';

/**
 * The button is circular, has an icon, and usually
 * overlayed over the main UI in a prominent place.
 *
 * @prop [style] - Style applied to the outermost component.
 * @prop [wrapperStyle] - Style applied to the wrapper component.
 * @prop disabled - If 'true' component can't be pressed and
 *   becomes visibly inactive.
 * @prop size - Diameter of the component in pixels.
 * @prop Icon - Icon component to render.
 * @prop logo - Image assests.
 * @prop onPress - Event called on component press.
 */

export const FloatingActionButton = props => {
  const {
    style,
    wrapperStyle,
    size,
    disabled,
    onPress,
    Icon,
    logo,
    accessibilityLabel,
    progress,
  } = props;

  const iconSize = Math.trunc(size / 2.7);

  const customWrapperStyle = {
    width: moderateScale(size, 0.2),
    height: moderateScale(size, 0.2),
    borderRadius: moderateScale(size),
    opacity: disabled ? 0.25 : 1,
  };
  const iconStyle = {
    margin: Math.trunc(size / 4),
  };

  if (progress) {
    return (
      <View style={[styles.wrapper, customWrapperStyle]}>
        <Loading />
      </View>
    );
  }

  return (
    <Touchable
      style={style}
      onPress={disabled ? undefined : onPress}
      accessibilityLabel={accessibilityLabel}>
      <View style={[styles.wrapper, customWrapperStyle, wrapperStyle]}>
        {Icon && (
          <Icon
            style={iconStyle}
            icon={logo || images.ic_plus}
            //size={iconSize}
            width={iconSize}
            height={iconSize}
            color={whiteColor}
          />
        )}
      </View>
    </Touchable>
  );
};

FloatingActionButton.propTypes = {
  style: PropTypes.any,
  wrapperStyle: PropTypes.any,
  size: PropTypes.number,
  disabled: PropTypes.bool,
  onPress: PropTypes.func,
  Icon: PropTypes.func,
  accessibilityLabel: PropTypes.string,
  progress: PropTypes.bool,
};
