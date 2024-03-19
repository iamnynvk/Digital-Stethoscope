import React from 'react';
import {Text, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {Shimmer, SvgIcon} from '@/components';
import FastImage from 'react-native-fast-image';

/**
 * User avatar display with support for falling back to using the user's title as the avatar.
 *
 * @prop title - Renders title in the placeholder.
 * @prop imageUri - Source image on the internet to display.
 * @prop titleStyle - Style for the title.
 * @prop titleWrapper - Custom style for the title wrapper.
 * @prop imageStyle - Custom image styling to append to the Image component displays the source image.
 * @prop shimImageStyle - Custom style to append to the placeholder wrapper.
 * @prop isLoading - Shows a shimmer.
 */
export const UserAvatar = ({
  title,
  imageUri,
  titleStyle,
  titleWrapper,
  imageStyle,
  shimImageStyle,
  isLoading,
}) => (
  <Shimmer
    style={isLoading && [styles.shimUserImage, shimImageStyle]}
    isVisible={!isLoading}>
    {imageUri ? (
      <FastImage
        style={[styles.image, imageStyle]}
        source={{
          uri: imageUri,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
    ) : (
      <View style={[styles.textContainer, titleWrapper]}>
        <Text
          style={[styles.text, titleStyle]}
          numberOfLines={1}
          ellipsizeMode="tail">
          {!!title ? title.charAt(0) : ' '}
        </Text>
      </View>

      // <SvgIcon
      //   icon={images.ic_user_placeholder}
      //   width={62}
      //   height={62}
      //   style={[styles.image, imageStyle]}
      // />
    )}
  </Shimmer>
);

UserAvatar.propTypes = {
  title: PropTypes.string,
  imageUri: PropTypes.string,
  titleStyle: PropTypes.any,
  titleWrapper: ViewPropTypes.style,
  imageStyle: ViewPropTypes.style,
  shimImageStyle: ViewPropTypes.style,
  isLoading: PropTypes.bool,
};
