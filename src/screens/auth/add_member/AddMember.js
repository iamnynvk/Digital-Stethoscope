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
  UploadImage,
  CountryCodeInput,
} from '@/components';
import {styles} from '@/screens/auth/add_member/AddMember.styles';
import {strings} from '@/localization';
import images from '@/assets/images';
import {showImagePicker} from '@/utils/mediaPicker';
import {formateDate} from '@/utils/date';
import {validateForm} from '@/screens/auth/add_member/AddMember.validation';
import {fetchCurrentLocation, geoAddress} from '@/utils/geo';
import {AuthContext} from '@/navigation/AuthProvider';
import {useUpload} from '@/hooks/useUpload';
import {CustomDatePicker} from '@/components/DatePicker';
import {
  getImageDocId,
  getGeoPoint,
  convertDateToTimestamp,
  getAuthUserId,
  convertTimestampToDate,
} from '@/utils/firebase';
import NavigationService from '@/navigation/NavigationService';
import useStateRef from '@/hooks/useStateRef';
import {NAVIGATION} from '@/constants';
import {CountryPickerModal} from '@/components/Modal/CountryPickerModal';

const countryData = require('@/components/Modal/countries.js');

const AddMember = props => {
  const memberItem = props.route.params?.member;

  //refs
  const datePickerRef = useRef(null);
  const countryModalRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [relation, setRelation] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [address, setAddress] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [member, setMember, memberRef] = useStateRef(memberItem);
  const [loading, setLoading] = useState(false);
  const [memberId, setMemberId] = useState(
    memberItem ? memberItem.userId : getImageDocId(),
  );
  const [userProfileImg, setUserProfileImg] = useState('');
  const [country, setCountry, countryRef] = useStateRef({
    callingCode: '91',
  });

  const {addMember, updateMemberInfo} = useContext(AuthContext);

  //Upload file
  const [{downloadURL, uploading, progress, imageResponse}, monitorUpload] =
    useUpload();

  useEffect(() => {
    setUserDetail();
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('beforeRemove', () => {
      if (props.route.params && props.route.params.onGoBack) {
        props.route.params.onGoBack(memberRef.current);
      }
    });

    return () => unsubscribe();
  }, [props.navigation]);

  const setUserDetail = () => {
    if (memberItem) {
      setFirstName(memberItem.firstName);
      setLastName(memberItem.lastName);
      setEmail(memberItem.email);
      setDateOfBirth(convertTimestampToDate(memberItem?.dateOfBirth));
      setGender(memberItem.gender);
      setUserProfileImg(memberItem.profileImg);
      setPhoneNumber(memberItem.phoneNumber);
      setRelation(memberItem.relation);
      if (member?.location) {
        setLatitude(member.location?._latitude);
        setLongitude(member.location?._longitude);
      }
      if (member?.address) {
        setAddress(member.address);
      }
      if (member.countryCode) {
        console.log('This block', member.countryCode);
        setCountry({
          callingCode: member.countryCode,
        });
      }
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
          setAddress(address);
        }
      }
    });
  };

  const onAddMember = async () => {
    if (
      !loading &&
      validateForm(
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        phoneNumber,
        relation,
      )
    ) {
      Keyboard.dismiss();
      setLoading(true);

      const member = {
        firstName,
        lastName,
        email,
        dateOfBirth: convertDateToTimestamp(dateOfBirth),
        gender,
        phoneNumber,
        countryCode: country.callingCode,
        profileImg: downloadURL || memberItem?.profileImg || '',
        userId: memberId,
        status: 'active',
        relation,
        group: getAuthUserId(),
      };
      if (latitude && longitude) {
        member.location = getGeoPoint(latitude, longitude);
      }
      if (address) {
        member.address = address;
      }
      if (memberItem) {
        await updateMemberInfo(memberItem.userId, member);
      } else {
        await addMember(memberId, member);
      }

      setMember(member);
      NavigationService.goBack();
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Scaffold>
        <Text style={styles.headerText}>
          {memberItem
            ? strings.updateProfile.updateMemberHeader
            : strings.updateProfile.addMemberHeader}
        </Text>
        <Text style={styles.subHeaderText}>
          {memberItem
            ? strings.updateProfile.updateMemberSubHeader
            : strings.updateProfile.addMemberSubHeader}
        </Text>

        <UploadImage
          profileImage={userProfileImg || downloadURL}
          uploading={uploading}
          imageResponse={imageResponse}
          progress={progress}
          onChangeImage={() =>
            showImagePicker(image => {
              monitorUpload(memberId, image);
              setUserProfileImg(null);
            })
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

        <CountryCodeInput
          value={phoneNumber}
          label={strings.login.inputLabel}
          onChangeText={text => setPhoneNumber(text)}
          countryCode={country.callingCode}
          keyboardType="number-pad"
          autoCompleteType="tel"
          mode="outlined"
          onCountryClick={() =>
            countryModalRef.current?.openModal(countryRef.current.callingCode)
          }
        />
        {/* <Input
            label={strings.updateProfile.contact}
            placeholder={strings.updateProfile.contactHint}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={value => setPhoneNumber(value)}
          /> */}

        <Spacer size={20} />

        <Input
          label={strings.updateProfile.relation}
          placeholder={strings.updateProfile.relationHint}
          value={relation}
          onChangeText={value => setRelation(value)}
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

        <Spacer size={35} />

        {/* <TextButton
          label={`${'+'}${strings.updateProfile.addFamilyMembers}`}
          textStyle={styles.addMemberTitle}
          style={styles.addMemberWrapper}
        />
        <Spacer size={30} /> */}
      </Scaffold>

      <Button
        text={
          memberItem
            ? strings.updateProfile.updateMemberButton
            : strings.updateProfile.addMemberButton
        }
        onPress={onAddMember}
        progress={loading}
      />

      <CustomDatePicker
        ref={datePickerRef}
        date={dateOfBirth}
        onDateChange={selectedDate => setDateOfBirth(selectedDate)}
      />
      <CountryPickerModal
        ref={countryModalRef}
        countryData={countryData}
        defaultCountry={countryRef.current.callingCode}
        onSelect={country => {
          setCountry({
            countryCode: country.countryCode,
            countryFlag: country.flag,
            callingCode: country.countryCallingCode,
          });
        }}
      />
    </Screen>
  );
};

export default AddMember;
