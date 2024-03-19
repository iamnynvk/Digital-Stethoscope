import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {Separator, SvgIcon} from '@/components';
import {textColorPrimary} from '@/theme/colors';
import {FONT_MEDIUM} from '@/theme/typography';

export const UserInfo = props => {
  const {label, value, icon} = props;
  return (
    <View>
      <View style={styles.container}>
        <SvgIcon icon={icon} />
        <Text style={[styles.text, styles.labelText]}>{label}</Text>
        <View style={{flex: 1}} />
        <Text style={styles.text}>{value}</Text>
      </View>
      <Separator />
    </View>
  );
};

UserInfo.propTypes = {
  label: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'center',
  },
  text: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 16,
    },
  },
  labelText: {
    color: textColorPrimary,
    marginHorizontal: 9,
  },
});
