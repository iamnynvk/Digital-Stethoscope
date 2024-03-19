import React from 'react';
import PropTypes from 'prop-types';
import {View, Text} from 'react-native';
import styles from './styles';
import {SvgIcon} from '../SvgIcon';
import {Touchable} from '../TouchableItem';
import {Separator} from '../Separator';
import {UserAvatar} from '../UserAvatar';
import images from '@/assets/images';

const MemberListItem = ({
  name,
  email,
  imageUri,
  isLastItem,
  onItemPress,
  onDeletePress,
}) => (
  <View style={styles.container}>
    <Touchable onPress={onItemPress}>
      <View style={styles.memberListItem}>
        <UserAvatar
          imageUri={imageUri}
          imageStyle={styles.memberImage}
          title={name}
          titleStyle={styles.userName}
          titleWrapper={styles.userImageTitle}
        />

        <View>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <View style={styles.flexOne}></View>
        <Touchable onPress={onDeletePress}>
          <SvgIcon icon={images.ic_cancel} style={styles.removeMemberIcon} />
        </Touchable>
      </View>
    </Touchable>

    {!isLastItem && <Separator style={styles.separator} />}
  </View>
);

MemberListItem.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  imageUri: PropTypes.string,
  isLastItem: PropTypes.bool,
  onItemPress: PropTypes.func,
  onDeletePress: PropTypes.func,
};

export default MemberListItem;
