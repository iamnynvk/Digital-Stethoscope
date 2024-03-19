import React from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {SvgIcon} from '../SvgIcon';
import {Input} from '../Input';
import {RawLabel} from '../RawLabel';
import {Touchable} from '../TouchableItem';
import images from '@/assets/images';
import {primaryBgColor} from '@/theme/colors';

/**
 * A country code input component using Input internally.
 * Provides a 'country selection' button.
 */

export const CountryCodeInput = props => {
  const {label, countryCode, onCountryClick, ...restProps} = props;
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.container}>
        <Touchable onPress={onCountryClick}>
          <View style={styles.countryCodeContainer}>
            <RawLabel style={styles.countryCodeText} text={'+' + countryCode} />
            <SvgIcon
              icon={images.ic_drop_down_arrow}
              height={20}
              width={20}
              color={primaryBgColor}
              style={styles.icon}
            />
            <View style={styles.viewLine} />
          </View>
        </Touchable>

        <Input
          autoCorrect={false}
          autoCapitalize="none"
          style={styles.inputStyle}
          wrapperStyle={styles.inputWrapper}
          {...restProps}
        />
      </View>
    </>
  );
};

CountryCodeInput.propTypes = {
  label: PropTypes.string,
  countryCode: PropTypes.string,
  onCountryClick: PropTypes.func,
};
