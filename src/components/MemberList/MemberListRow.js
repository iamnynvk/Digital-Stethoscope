import React from 'react';
import {View} from 'react-native';
import PropTypes from 'prop-types';
import MemberListItem from './MemberListItem';

/**
 * Member list row component.
 *
 * @prop members - Array items of Members.
 * @prop onMemberPress - Event called on list item press.
 * @prop onRemoveMember - Event called on remove icon press.
 */
export const MemberListRow = props => {
  const {members, onMemberPress, onRemoveMember} = props;

  const renderRowItem = (item, index) => (
    <MemberListItem
      key={item.userId}
      name={item.firstName}
      email={item.email}
      imageUri={item.profileImg}
      onItemPress={() => onMemberPress && onMemberPress(item)}
      onDeletePress={() => onRemoveMember && onRemoveMember(item)}
      isLastItem={item === members.slice(-1).pop()}
    />
  );

  return <View>{members.map(renderRowItem)}</View>;
};

MemberListRow.propTypes = {
  members: PropTypes.arrayOf(PropTypes.object).isRequired,
  onMemberPress: PropTypes.func,
  onRemoveMember: PropTypes.func,
};
