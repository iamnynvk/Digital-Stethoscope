import React, {useContext, useEffect, useRef, useState} from 'react';
import {Keyboard, Text, View} from 'react-native';
import {
  Button,
  Input,
  Scaffold,
  Screen,
  Spacer,
  SvgIcon,
  TextButton,
  Touchable,
  GenderSelector,
  MemberListRow,
  UploadImage,
  BackButton,
} from '@/components';
import {CustomDatePicker} from '@/components/DatePicker';
import {styles} from '@/screens/auth/update_profile/UpdateProfile.styles';
import useStateRef from '@/hooks/useStateRef';
import useAuth from '@/hooks/useAuth';
import {strings} from '@/localization';
import images from '@/assets/images';
import {showImagePicker} from '@/utils/mediaPicker';
import {formateDate} from '@/utils/date';
import {validateForm} from '@/screens/auth/update_profile/UpdateProfile.validation';
import {fetchCurrentLocation, geoAddress} from '@/utils/geo';
import NavigationService from '@/navigation/NavigationService';
import {NAVIGATION, PREFERENCES} from '@/constants';
import {AuthContext} from '@/navigation/AuthProvider';
import {useUpload} from '@/hooks/useUpload';
import {
  getAuthUserId,
  getGeoPoint,
  convertDateToTimestamp,
  convertTimestampToDate,
} from '@/utils/firebase';
import {showAsyncAlert} from '@/utils/info';
import {storage} from '@/utils/storage';

const UpdateProfile = props => {
  /**
   *isFrom - Value is AppNavigator or AuthNavigator.
   *If value is AppNavigation, it means user want to update it's profile.
   */
  const isFrom = props.route.params?.isFrom;
  const members = props.route.params?.memberList;

  const phoneCountryCode = props.route.params?.countryCode;
  const phoneNo = props.route.params?.phoneNumber;

  const {authUser, setAuthUser} = useAuth();
  const datePickerRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState(phoneNo);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [address, setAddress] = useState('');
  const [userProfileImg, setUserProfileImg] = useState('');
  const [countryCode, setCountryCode] = useState(phoneCountryCode);
  const [memberList, setMemberList] = useState([]);
  const [reload, setReload, reloadRef] = useStateRef(false);

  const [loading, setLoading] = useState(false);

  const {registerUserDetail, updateUserProfile, deleteMemberInfo} =
    useContext(AuthContext);

  //Upload image
  const [{downloadURL, uploading, progress, imageResponse}, monitorUpload] =
    useUpload();

  useEffect(() => {
    if (isFrom === NAVIGATION.APP_NAVIGATOR) {
      setUserDetail();
    } else {
      fetchUserLocation();
    }
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('beforeRemove', () => {
      if (props.route.params && props.route.params.onGoBack) {
        props.route.params.onGoBack(reloadRef.current);
      }
    });

    return () => unsubscribe();
  }, [props.navigation]);

  const setUserDetail = () => {
    if (authUser) {
      setFirstName(authUser.firstName);
      setLastName(authUser.lastName);
      setEmail(authUser.email);
      setDateOfBirth(convertTimestampToDate(authUser?.dateOfBirth));
      setGender(authUser.gender);
      setUserProfileImg(authUser.profileImg);
      //setCountryCode(authUser?.countryCode);
      setPhoneNumber('+' + authUser?.countryCode + ' ' + authUser.phoneNumber);

      if (authUser?.location) {
        setLatitude(authUser.location?._latitude);
        setLongitude(authUser.location?._longitude);
      }

      if (authUser?.address) {
        setAddress(authUser.address);
      }
      const membersData = members?.filter(
        member => member.userId !== authUser.userId,
      );
      if (membersData && membersData.length) setMemberList(membersData);
    } else {
      fetchUserLocation();
    }
  };

  const fetchUserLocation = () => {
    fetchCurrentLocation(async location => {
      if (location) {
        setLatitude(Number(location.latitude));
        setLongitude(Number(location.longitude));

        const address = await geoAddress(
          Number(location.latitude),
          Number(location.longitude),
        );
        if (address) {
          console.log(address);
          setAddress(address);
        }
      }
    });
  };

  const onUpdateProfile = async () => {
    Keyboard.dismiss();
    if (
      !loading &&
      validateForm(
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        phoneNumber,
        downloadURL,
      )
    ) {
      setLoading(true);
      const user = {
        firstName,
        lastName,
        dateOfBirth: convertDateToTimestamp(dateOfBirth),
        gender,
        profileImg: downloadURL || userProfileImg,
        relation: 'self',
      };

      if (latitude && longitude) {
        user.location = getGeoPoint(latitude, longitude);
      }
      if (address) {
        user.address = address;
      }
      let result;
      if (isFrom === NAVIGATION.APP_NAVIGATOR) {
        result = await updateUserProfile(authUser.userId, user);
      } else {
        user.countryCode = countryCode;
        user.phoneNumber = phoneNumber;
        user.email = email;
        user.userId = getAuthUserId();
        user.status = 'active';
        user.group = getAuthUserId();
        await registerUserDetail(user);
      }

      setLoading(false);
      if (result && isFrom === NAVIGATION.APP_NAVIGATOR) {
        setReload(true);
        NavigationService.goBack();
      }
    }
  };

  const handleAddMember = () => {
    NavigationService.navigate(NAVIGATION.ADD_MEMBER, {
      onGoBack: member => {
        if (member) {
          //Add member in memberList state
          const currentMembers = [...memberList];
          currentMembers.push(member);
          setMemberList(currentMembers);
          setReload(true);
        }
      },
    });
  };

  const handleUpdateMember = member => {
    NavigationService.navigate(NAVIGATION.ADD_MEMBER, {
      member,
      onGoBack: member => {
        if (member) {
          //Update member detail in memberList state
          const index = memberList.findIndex(
            item => item.userId == member.userId,
          );
          console.log(member.userId);
          if (index != -1) {
            const currentMembers = [...memberList];
            currentMembers[index] = member;
            setMemberList(currentMembers);
            setReload(true);
          }
        }
      },
    });
  };

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
        const index = memberList.findIndex(
          item => item.userId == member.userId,
        );

        if (index != -1) {
          const currentMembers = [...memberList];
          currentMembers.splice(index, 1);
          setMemberList(currentMembers);
        }
      }
    }
  };

  return (
    <Screen>
      <Scaffold>
        {isFrom === NAVIGATION.APP_NAVIGATOR ? (
          <BackButton
            title={strings.updateProfile.header}
            style={styles.backButton}
          />
        ) : (
          <Text style={styles.headerText}>{strings.updateProfile.header}</Text>
        )}

        {isFrom != NAVIGATION.APP_NAVIGATOR ? (
          <Text style={styles.subHeaderText}>
            {strings.updateProfile.subHeader}
          </Text>
        ) : null}

        <UploadImage
          profileImage={downloadURL || userProfileImg}
          uploading={uploading}
          imageResponse={imageResponse}
          progress={progress}
          onChangeImage={() =>
            showImagePicker(image =>
              monitorUpload(
                getAuthUserId(),
                image,
                isFrom === NAVIGATION.APP_NAVIGATOR ? true : false,
                url => {
                  setAuthUser({...authUser, ...{profileImg: url}});
                  storage.set(PREFERENCES.USER, {
                    ...authUser,
                    ...{profileImg: url},
                  });
                  setReload(true);
                },
              ),
            )
          }
        />

        <Spacer size={26} />

        <Input
          label={strings.updateProfile.firstName}
          placeholder={strings.updateProfile.firstNameHint}
          value={firstName}
          onChangeText={value => setFirstName(value)}
        />

        <Spacer size={20} />

        <Input
          label={strings.updateProfile.lastName}
          placeholder={strings.updateProfile.lastNameHint}
          value={lastName}
          onChangeText={value => setLastName(value)}
        />

        <Spacer size={20} />

        <Input
          label={strings.updateProfile.email}
          placeholder={strings.updateProfile.emailHint}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={value => setEmail(value)}
          editable={isFrom === NAVIGATION.APP_NAVIGATOR ? false : true}
          selectTextOnFocus={isFrom === NAVIGATION.APP_NAVIGATOR ? false : true}
          textInputStyle={
            isFrom === NAVIGATION.APP_NAVIGATOR && styles.disableTextInputStyle
          }
        />

        <Spacer size={20} />

        <Touchable onPress={() => datePickerRef.current?.openDatePicker()}>
          <View pointerEvents="none">
            <Input
              label={strings.updateProfile.dateOfBirth}
              placeholder={strings.updateProfile.dateOfBirthHint}
              defaultValue={
                dateOfBirth && formateDate(dateOfBirth, 'DD-MM-YYYY')
              }
            />
          </View>
        </Touchable>

        <Spacer size={20} />

        <GenderSelector
          selectedGender={gender}
          onSelect={gender => setGender(gender)}
        />

        <Spacer size={20} />

        <Input
          label={strings.updateProfile.contact}
          placeholder={strings.updateProfile.contactHint}
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={value => setPhoneNumber(value)}
          editable={isFrom === NAVIGATION.APP_NAVIGATOR ? false : true}
          selectTextOnFocus={isFrom === NAVIGATION.APP_NAVIGATOR ? false : true}
          textInputStyle={
            isFrom === NAVIGATION.APP_NAVIGATOR && styles.disableTextInputStyle
          }
        />

        <Spacer size={20} />

        <View style={styles.locationSection}>
          <View>
            <Text style={styles.locationTitle}>{strings.common.latitude}</Text>
            <Text style={styles.locationText}>{latitude?.toFixed(2)}° N</Text>
          </View>

          <View style={styles.flexOne} />

          <View>
            <Text style={styles.locationTitle}>{strings.common.longitude}</Text>
            <Text style={styles.locationText}>{longitude?.toFixed(2)}° E</Text>
          </View>

          <View style={styles.flexOne} />

          <Touchable
            style={styles.chooseLocationContainer}
            onPress={() => {
              NavigationService.navigate(NAVIGATION.MAP, {
                region: {
                  latitude,
                  longitude,
                },
                onGoBack: (location, address) => {
                  if (location) {
                    setLatitude(location.latitude);
                    setLongitude(location.longitude);
                  }
                  if (address) {
                    setAddress(address);
                  }
                },
              });
            }}>
            <SvgIcon icon={images.ic_location_pin} width={17} height={23} />
          </Touchable>
        </View>

        {address ? (
          <>
            <Spacer size={20} />
            <Touchable>
              <View pointerEvents="none">
                <View>
                  <Text style={styles.locationTitle}>
                    {strings.updateProfile.address}
                  </Text>
                  <Text style={styles.locationText}>{address}</Text>
                </View>
              </View>
            </Touchable>
          </>
        ) : null}

        {memberList?.length ? (
          <Text style={styles.inputLabel}>
            {strings.updateProfile.familyMembers}
          </Text>
        ) : null}

        <MemberListRow
          members={memberList}
          onMemberPress={member => handleUpdateMember(member)}
          onRemoveMember={member => handleRemoveMember(member)}
        />

        <Spacer size={35} />

        <TextButton
          label={`${'+'}${strings.updateProfile.addFamilyMembers}`}
          textStyle={styles.addMemberTitle}
          style={styles.addMemberWrapper}
          onPress={() => handleAddMember()}
        />
        <Spacer size={30} />
      </Scaffold>

      <Button
        text={
          isFrom === NAVIGATION.APP_NAVIGATOR
            ? strings.updateProfile.update
            : strings.updateProfile.button
        }
        onPress={onUpdateProfile}
        progress={loading}
      />

      <CustomDatePicker
        ref={datePickerRef}
        date={dateOfBirth}
        onDateChange={selectedDate => setDateOfBirth(selectedDate)}
      />
    </Screen>
  );
};

export default UpdateProfile;
