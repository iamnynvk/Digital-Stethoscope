import React, {useEffect} from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {styles} from '@/screens/dashboard/profile/Profile.styles';
import {
  BackButton,
  Button,
  MemberListRow,
  Scaffold,
  Spacer,
  UserAvatar,
} from '@/components';
import Svg, {Circle} from 'react-native-svg';
import {screenHeight, screenWidth} from '@/theme/spacing';
import {primaryBgColor} from '@/theme/colors';
import images from '@/assets/images';
import {strings} from '@/localization';
import {UserInfo} from './UserInfo';
import useAuth from '@/hooks/useAuth';
import {capitalize, getFullName} from '@/utils/misc';
import {formateDate, getAge} from '@/utils/date';
import {showAsyncAlert} from '@/utils/info';
import useStateRef from '@/hooks/useStateRef';
import {convertTimestampToDate} from '@/utils/firebase';

export const Profile = props => {
  const user = props.route.params?.user;
  const memberList = props.route.params?.memberList;
  const {authUser, deleteMemberInfo, logout} = useAuth();
  const [loading, setLoading, loadingRef] = useStateRef(false);
  const [memberListData, setMemberListData, memberListDataRef] = useStateRef(
    [],
  );

  useEffect(() => {
    const members = memberList?.filter(
      member => member.userId !== authUser.userId,
    );
    if (members && members.length) setMemberListData(members);
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('beforeRemove', () => {
      if (props.route.params && props.route.params.onGoBack) {
        if (memberList) {
          props.route.params.onGoBack(
            memberList.length - 1 != memberListDataRef.current.length,
          );
        }
      }
    });

    return () => unsubscribe();
  }, [props.navigation]);

  const handleRemoveMember = async member => {
    const choice = await showAsyncAlert(
      strings.common.alertTitle,
      strings.updateProfile.removeMemberMessage,
      [
        {text: strings.common.yes, onPress: () => 'yes'},
        {text: strings.common.cancel, onPress: () => Promise.resolve('no')},
      ],
      {
        cancelable: true,
        onDismiss: () => 'no',
      },
    );

    if (choice === 'yes') {
      const result = await deleteMemberInfo(member.userId);
      if (result) {
        const index = memberListDataRef.current.findIndex(
          item => item.userId == member.userId,
        );

        if (index != -1) {
          const currentMembers = [...memberListDataRef.current];
          currentMembers.splice(index, 1);
          setMemberListData(currentMembers);
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <Scaffold
        wrapperStyle={styles.scaffold}
        scrollContainerStyle={styles.scrollContainer}>
        <Svg
          height={screenHeight * 0.24}
          width={screenWidth + 12}
          style={styles.curveBackground}>
          <Circle
            cx={screenWidth / 2}
            cy={`-${560 - screenHeight * 0.24}`}
            r="560"
            fill={primaryBgColor}
          />
        </Svg>
        <View style={styles.scrollItemWrapper}>
          <BackButton
            icon={images.ic_back_arrow_white}
            style={styles.backArrow}
            title={strings.profile.header}
            titleStyle={styles.headerTitle}
          />

          <UserAvatar
            imageUri={user?.profileImg}
            imageStyle={styles.userImage}
            title={getFullName(user.firstName, user.lastName)}
            titleStyle={styles.userName}
            titleWrapper={styles.userImageTitle}
          />

          <View>
            <Text style={styles.userName}>
              {getFullName(user.firstName, user.lastName)}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
          </View>

          <Spacer size={26} />

          <UserInfo
            label="Gender"
            value={capitalize(user?.gender)}
            icon={images.ic_gender}
          />

          <Spacer size={16} />

          <UserInfo
            label="DOB"
            value={formateDate(
              convertTimestampToDate(user?.dateOfBirth),
              'DD-MM-YYYY',
            )}
            icon={images.ic_date_of_birth}
          />

          <Spacer size={16} />

          <UserInfo
            label="Age"
            value={getAge(convertTimestampToDate(user?.dateOfBirth))}
            icon={images.ic_age}
          />

          <Spacer size={16} />

          <UserInfo
            label="Contact"
            value={
              user.countryCode
                ? '+' + user?.countryCode + ' ' + user?.phoneNumber
                : user?.phoneNumber
            }
            icon={images.ic_contact}
          />

          {authUser.userId === user.userId &&
          memberListDataRef.current &&
          memberListDataRef.current?.length ? (
            <Text style={styles.inputLabel}>
              {strings.updateProfile.familyMembers}
            </Text>
          ) : null}

          {authUser.userId === user.userId &&
          memberListDataRef.current &&
          memberListDataRef.current?.length ? (
            <MemberListRow
              members={memberListDataRef.current}
              onRemoveMember={member => handleRemoveMember(member)}
            />
          ) : null}
        </View>
      </Scaffold>
      {/* {authUser.userId === user.userId && (
        <Button
          text={strings.profile.logout}
          onPress={onLogoutPress}
          progress={loading}
        />
      )} */}

      <SafeAreaView />
    </View>
  );
};
export default Profile;
