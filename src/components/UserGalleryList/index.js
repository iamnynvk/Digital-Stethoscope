import React from 'react';
import PropTypes from 'prop-types';
import {View, FlatList} from 'react-native';
import UserListItem from './components/UserListItem';
import styles from './styles';

/**
 * User's list row component.
 *
 * @prop users - Array items of Users.
 * @prop onSelect - Event called on list item press.
 */
export const UserGalleryList = ({users,selectedUser, isLoading, onSelect}) => {
  const mockData = [1, 2, 3, 4, 5];

  const keyExtractor = item =>
    isLoading ? item.toString() : String(item.userId);

  const renderItem = ({item, index}) => (
    <UserListItem
      userId={item.userId}
      name={item.firstName}
      profileImg={item.profileImg}
      isLoading={isLoading}
      onSelect={() => !isLoading && onSelect && onSelect(item)}
      selectedUser={selectedUser}
    />
  );

  return (
    <View>
      <FlatList
        data={isLoading ? mockData : users}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.userGalleyContainer}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

UserGalleryList.propTypes = {
  users: PropTypes.array,
  onSelect: PropTypes.func,
};
