import React from 'react';
import {View, Text} from 'react-native';
import {Separator, Shimmer, SvgIcon, Touchable, UserAvatar} from '@/components';
import PropTypes from 'prop-types';
import styles from './styles';
import images from '@/assets/images';
import {moderateVerticalScale} from '@/theme/scaling';

/**
 * User information view.
 *
 * @prop name - User name.
 * @prop email - User email.
 * @prop profileImg - User profile image.
 * @prop isLoading - Shows a shimmer in place of the view .
 * @prop onItemPress - Event called on item press.
 */

export const UserInfoView = props => {
  const {name, email, profileImg, isLoading, onItemPress} = props;

  return (
    <View>
      <Touchable onPress={onItemPress} activeOpacity={1}>
        <View style={styles.userInfoContainer}>
          <UserAvatar
            imageUri={profileImg}
            imageStyle={styles.userImage}
            shimImageStyle={styles.userImage}
            isLoading={isLoading}
            title={name}
            titleStyle={styles.userName}
            titleWrapper={styles.userImageTitle}
          />

          <View>
            <Shimmer
              style={isLoading && styles.shimUserName}
              isVisible={!isLoading}>
              <Text
                style={styles.userName}
                numberOfLines={1}
                ellipsizeMode="tail">
                {name}
              </Text>
            </Shimmer>

            <Shimmer
              style={isLoading && styles.shimUserEmail}
              isVisible={!isLoading}>
              <Text
                style={styles.userEmail}
                numberOfLines={1}
                ellipsizeMode="tail">
                {email}
              </Text>
            </Shimmer>
          </View>

          <View style={styles.flexOne} />

          {!isLoading && (
            <SvgIcon
              icon={images.ic_right_arrow}
              width={moderateVerticalScale(9)}
              height={moderateVerticalScale(16)}
            />
          )}
        </View>
      </Touchable>
      {!isLoading && <Separator style={styles.separator} />}
    </View>
  );
};

UserInfoView.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  profileImg: PropTypes.string,
  isLoading: PropTypes.bool,
  onItemPress: PropTypes.func,
};
