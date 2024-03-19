import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, ViewPropTypes} from 'react-native';
import styles from './styles';
import {strings} from '@/localization';

export const EmptyList = ({
  containerStyle,
  text = strings.common.emptyData,
}) => (
  <View style={[styles.container, containerStyle]}>
    <Text style={styles.emptyText}>{text}</Text>
  </View>
);

EmptyList.propTypes = {
  text: PropTypes.string,
  containerStyle: ViewPropTypes.style,
};
