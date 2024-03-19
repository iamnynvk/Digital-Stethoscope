import React, {useState, useCallback} from 'react';
import {TextInput, View, Text, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {inputHintColor} from '@/theme/colors';

/**
 * A light abstraction over the standard TextInput component
 *
 * @prop [style] - Can override our default style for inputs.
 * @prop [inputWrapper] - Can override our default style for inputs wrapper components.
 * @prop placeholder - Translated before passing to TextInput as
 *   a prop of the same name.
 * @prop [textInputRef] - Passed to TextInput in `ref`.
 * @prop [textInputStyle] - Text input style.
 * @prop ...all other TextInput props - Passed through verbatim to TextInput.
 *
 */
export const Input = props => {
  const {
    style,
    wrapperStyle,
    textInputRef,
    textInputStyle,
    label,
    Icon,
    ...restProps
  } = props;

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const renderLeftIcon = () => {
    if (Icon !== null) {
      return Icon;
    }
    return null;
  };

  return (
    <View style={style}>
      {label && <Text style={styles.inputLabel}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          wrapperStyle,
          isFocused ? styles.borderStyleHighLighted : styles.borderStyleBase,
        ]}>
        {renderLeftIcon()}
        <TextInput
          style={[
            styles.input,
            textInputStyle,
            {paddingHorizontal: Icon ? 8 : 12},
          ]}
          placeholderTextColor={inputHintColor}
          onFocus={handleFocus}
          onBlur={handleBlur}
          ref={textInputRef}
          allowFontScaling={false}
          {...restProps}
        />
      </View>
    </View>
  );
};

Input.propTypes = {
  styles: ViewPropTypes.style,
  wrapperStyle: ViewPropTypes.style,
  textInputRef: PropTypes.object,
  textInputStyle: PropTypes.any,
  label: PropTypes.string,
  Icon: PropTypes.object,
};
