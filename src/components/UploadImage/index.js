import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {SvgIcon} from '../SvgIcon';
import {Touchable} from '../TouchableItem';
import {Loading} from '../Loading';
import FastImage from 'react-native-fast-image';
import images from '@/assets/images';
import {screenWidth} from '@/theme/spacing';

/**
 * User profile pic with image chooser.
 *
 * @prop profileImage - Uploaded image link.
 * @prop uploading - Image is iploading or not.
 * @prop progress - Uploading image prgress.
 * @prop imageResponse - Image object which containts image's data.
 * @prop onChangeImage - Event called on add new image icon press.
 */

export const UploadImage = props => {
  const {profileImage, uploading, progress, imageResponse, onChangeImage} =
    props;

  const renderUserImage = () => {
    if (uploading || profileImage) {
      return (
        <View>
          <FastImage
            style={styles.userImage}
            source={{
              uri: imageResponse ? imageResponse?.path : profileImage,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
          {(!profileImage || uploading) && (
            <View style={styles.imageOverlay}>
              {/* <Loading /> */}
              <Text style={styles.uploadText}>{progress + ' %' || 0}</Text>
            </View>
          )}
        </View>
      );
    } else {
      return (
        <SvgIcon
          icon={images.ic_user_placeholder}
          width={screenWidth * 0.36}
          height={screenWidth * 0.36}
        />
      );
    }
  };

  return (
    <View style={styles.userImageContainer}>
      {renderUserImage()}

      <Touchable onPress={onChangeImage}>
        <SvgIcon
          icon={images.ic_select_image}
          style={styles.chooseImageStyle}
        />
      </Touchable>
    </View>
  );
};

UploadImage.propTypes = {
  profileImage: PropTypes.string,
  uploading: PropTypes.bool,
  progress: PropTypes.number,
  imageResponse: PropTypes.object,
  onChangeImage: PropTypes.func,
};
