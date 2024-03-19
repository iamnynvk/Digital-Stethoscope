import React, {useContext, useRef, useState} from 'react';
import {View, Text, Keyboard} from 'react-native';
import {
  Button,
  CountryCodeInput,
  Scaffold,
  Screen,
  Spacer,
  SvgIcon,
  WebLink,
} from '@/components';
import {styles} from '@/screens/auth/login/Login.styles';
import images from '@/assets/images';
import {screenHeight, screenWidth} from '@/theme/spacing';
import {strings} from '@/localization';
import {isAndroid} from '@/utils/platform';
import FastImage from 'react-native-fast-image';
import {AuthContext} from '@/navigation/AuthProvider';
import {validateForm} from './Login.validation';
import {CountryPickerModal} from '@/components/Modal/CountryPickerModal';
import NavigationService from '@/navigation/NavigationService';
import {LINK, NAVIGATION} from '@/constants';

const countryData = require('@/components/Modal/countries.js');

const Login = () => {
  const {login} = useContext(AuthContext);

  //refs
  const countryModalRef = useRef(null);

  //state
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [country, setCountry] = useState({
    countryCode: 'IN',
    callingCode: '91',
  });

  const handlePhoneAuth = async () => {
    if (!loading && validateForm(phoneNumber)) {
      Keyboard.dismiss();
      setLoading(true);
      await login(country.callingCode, phoneNumber);
      setLoading(false);
    }
  };

  return (
    <>
      <Screen>
        <SvgIcon
          icon={images.bg_login}
          width={screenWidth}
          height={screenHeight * 0.8}
          style={styles.screenBackground}
          preserveAspectRatio="none"
        />
        <Scaffold>
          <View>
            <SvgIcon
              icon={images.hops_logo}
              width={screenWidth * 0.33}
              height={screenHeight * 0.09}
              style={styles.image}
            />

            <Spacer size={isAndroid ? 20 : 40} />

            <SvgIcon
              icon={images.img_stethoscope}
              width={screenWidth * 0.57}
              height={screenWidth * 0.57}
              style={styles.image}
            />

            <FastImage
              style={styles.appTitleImage}
              source={images.ic_app_title_logo}
              resizeMode={FastImage.resizeMode.contain}
            />

            <Spacer size={screenHeight * 0.03} />
            <Text style={styles.headerText}>{strings.login.header}</Text>
            <Spacer size={isAndroid ? 0 : 8} />
            <Text style={styles.subHeaderText}>{strings.login.subHeader}</Text>
          </View>

          <Spacer size={screenHeight * 0.04} />

          <CountryCodeInput
            value={phoneNumber}
            label={strings.login.inputLabel}
            onChangeText={text => setPhoneNumber(text)}
            countryCode={country.callingCode}
            keyboardType="number-pad"
            autoCompleteType="tel"
            mode="outlined"
            onCountryClick={() => countryModalRef.current?.openModal()}
          />
          <Spacer size={screenHeight * 0.03} />

          <View style={styles.webLinkContainer}>
            <WebLink
              title={strings.login.termsOfService}
              onPress={() =>
                NavigationService.navigate(NAVIGATION.WEB_SCREEN, {
                  title: strings.login.termsOfService,
                  link: LINK.TERMS_OF_SERVICE,
                })
              }
            />
            <Spacer size={3} horizontal />
            <WebLink title={'|'} />
            <Spacer size={3} horizontal />
            <WebLink
              title={strings.login.privacyPolicy}
              onPress={() =>
                NavigationService.navigate(NAVIGATION.WEB_SCREEN, {
                  title: strings.login.privacyPolicy,
                  link: LINK.PRIVACY_POLICY,
                })
              }
            />
          </View>

          <Spacer size={40} />
        </Scaffold>
        <Button
          text={strings.login.button}
          onPress={handlePhoneAuth}
          progress={loading}
          disabled={!phoneNumber}
        />
      </Screen>
      <CountryPickerModal
        ref={countryModalRef}
        countryData={countryData}
        onSelect={country => {
          setCountry({
            countryCode: country.countryCode,
            countryFlag: country.flag,
            callingCode: country.countryCallingCode,
          });
        }}
      />
    </>
  );
};

export default Login;
