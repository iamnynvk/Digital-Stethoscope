import React from 'react';
import {View} from 'react-native';
import styles from './styles';
import {RawLabel} from '../RawLabel';
import {Touchable} from '../TouchableItem';
import {Loading} from '../Loading';
import {loaderBgColor} from '@/theme/colors';

/**
 * A button modeled on Material Design's "text button" concept.
 */

export const TextButton = props => {
  const {leftMargin, rightMargin, label, onPress, textStyle, progress, style} =
    props;

  if (progress) {
    return (
      <View
        style={[
          styles.touchable,
          leftMargin && styles.leftMargin,
          rightMargin && styles.rightMargin,
          style,
        ]}>
        <Loading color={loaderBgColor} />
      </View>
    );
  }

  return (
    <Touchable
      style={[
        styles.touchable,
        leftMargin && styles.leftMargin,
        rightMargin && styles.rightMargin,
        style,
      ]}
      onPress={onPress}>
      <RawLabel style={[styles.text, textStyle]} text={label} />
    </Touchable>
  );
};
