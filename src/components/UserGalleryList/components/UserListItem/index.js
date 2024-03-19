import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import {Touchable, UserAvatar, Shimmer} from '@/components';
import styles from './styles';
import {getAuthUserId} from '@/utils/firebase';

const UserListItem = ({
  userId,
  name,
  profileImg,
  isLoading,
  onSelect,
  selectedUser,
}) => (
  <Touchable style={styles.container} onPress={onSelect}>
    <View style={styles.viewWrapper}>
      <UserAvatar
        imageUri={profileImg}
        isLoading={isLoading}
        title={name}
        imageStyle={userId == selectedUser && styles.imageBorder}
      />

      <Shimmer style={isLoading && styles.shimeTitle} isVisible={!isLoading}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
      </Shimmer>
    </View>
  </Touchable>
);

UserListItem.propTypes = {
  userId: PropTypes.string,
  name: PropTypes.string,
  profileImg: PropTypes.string,
  onSelect: PropTypes.func,
};

export default React.memo(UserListItem);
