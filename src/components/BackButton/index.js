import React from 'react';
import {Text, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {SvgIcon} from '../SvgIcon';
import {Touchable} from '../TouchableItem';
import images from '@/assets/images';
import NavigationService from '@/navigation/NavigationService';

/**
 * Custom back button let the user navigate to previous contain by clicking on that button.
 *
 * @prop [style] - Style object applied to the outermost component.
 * @prop [icon] - Image icon name to display back button icon
 * @prop title - The header text
 * @prop [titleStyle] - Style applied to the header title.
 * @prop onPress - Event called on button press.
 */

export const BackButton = props => {
  const {style, title, titleStyle, icon, onPress} = props;

  return (
    <View style={[styles.container, style]}>
      <Touchable
        style={styles.backButtonIcon}
        onPress={() => (onPress ? onPress() : NavigationService.goBack())}>
        <SvgIcon icon={icon || images.ic_back_arrow} width={25} height={25} />
      </Touchable>
      <View style={styles.titleWrapper}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      </View>
    </View>
  );
};

BackButton.propTypes = {
  style: ViewPropTypes.style,
  icon: PropTypes.string,
  title: PropTypes.string,
  titleStyle: PropTypes.any,
  onPress: PropTypes.func,
};
