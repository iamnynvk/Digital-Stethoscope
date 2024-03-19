import React from 'react';
import {Text, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {Touchable} from '../TouchableItem';
import {Loading} from '../Loading';

/**
 * A button component that is provides consistent look and feel
 * throughout the app. It can be disabled or show action-in-progress.
 *
 * If several buttons are on the same screen all or all but one should
 * have their `secondary` property set to `true`.
 *
 * @prop [style] - Style object applied to the outermost component.
 * @prop [textStyle] - Style applied to the button text.
 * @prop [progress] - Shows a progress indicator in place of the button text.
 * @prop [disabled] - If set the button is not pressable and visually looks disabled.
 * @prop [Icon] - Icon component to display in front of the button text
 * @prop text - The button text
 * @prop [secondary] - Less prominent styling, the button is not as important.
 * @prop onPress - Event called on button press.
 */

export const Button = props => {
  const {
    style,
    textStyle,
    text,
    uppercase,
    disabled,
    secondary,
    progress,
    onPress,
    Icon,
  } = props;

  const frameStyle = [
    styles.frame,
    disabled
      ? secondary
        ? styles.disabledSecondaryFrame
        : styles.disabledPrimaryFrame
      : secondary
      ? styles.secondaryFrame
      : styles.primaryFrame,
    style,
  ];

  const buttontextStyle = [
    styles.text,
    disabled
      ? styles.disabledText
      : secondary
      ? styles.secondaryText
      : styles.primaryText,
    textStyle,
    uppercase && {textTransform: 'uppercase'},
  ];

  const iconStyle = [
    styles.icon,
    secondary ? styles.secondaryIcon : styles.primaryIcon,
  ];

  if (progress) {
    return (
      <View style={frameStyle}>
        <Loading />
      </View>
    );
  }

  return (
    <View style={frameStyle}>
      <Touchable onPress={disabled ? undefined : onPress}>
        <View style={styles.buttonContent}>
          {!!Icon && <Icon style={iconStyle} size={25} />}
          <Text style={buttontextStyle}>
            <Text>{text}</Text>
          </Text>
        </View>
      </Touchable>
    </View>
  );
};

Button.defaultProps = {
  uppercase: false,
  disabled: false,
  secondary: false,
  progress: false,
};

Button.propTypes = {
  style: ViewPropTypes.style,
  textStyle: PropTypes.any,
  text: PropTypes.string,
  uppercase: PropTypes.bool,
  disabled: PropTypes.bool,
  secondary: PropTypes.bool,
  progress: PropTypes.bool,
  Icon: PropTypes.object,
  onPress: PropTypes.func,
};
