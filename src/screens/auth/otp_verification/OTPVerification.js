import React, {useContext, useState} from 'react';
import {View, Text} from 'react-native';
import {
  Button,
  Scaffold,
  Screen,
  Spacer,
  SvgIcon,
  TextButton,
} from '@/components';
import {styles} from '@/screens/auth/otp_verification/OTPVerification.styles';
import images from '@/assets/images';
import {strings} from '@/localization';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {screenHeight, screenWidth} from '@/theme/spacing';
import {AuthContext} from '@/navigation/AuthProvider';
import {validateForm} from './OTPVerification.validation';

const OTPVerification = props => {
  const countryCode = props.route.params?.countryCode;
  const phoneNumber = props.route.params?.phoneNumber;
  const confirmResult = props.route.params?.confirmation;

  //states
  const [otp, setOTP] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(confirmResult);

  const {otpVerification, resendOTP} = useContext(AuthContext);

  const handleVerification = async () => {
    if (!loading && confirmation && validateForm(otp)) {
      setLoading(true);
      await otpVerification(confirmation, countryCode, phoneNumber, otp);
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!loading && !resendOtpLoading && confirmation) {
      setResendOtpLoading(true);
      const confirmation = await resendOTP(countryCode, phoneNumber);
      setConfirmation(confirmation);
      setResendOtpLoading(false);
    }
  };

  return (
    <Screen>
      <Scaffold>
        <Spacer size={16} />

        <SvgIcon
          icon={images.img_verification_code}
          style={styles.image}
          width={screenWidth * 0.36}
          height={screenWidth * 0.36}
        />

        <Text style={styles.headerText}>{strings.otpVerification.header}</Text>

        <Text style={styles.subHeaderText}>
          {strings.otpVerification.subHeader}
        </Text>

        <Text style={styles.phoneNoText}>
          {'+' + countryCode + ' ' + phoneNumber}
        </Text>

        <Spacer size={35} />

        <Text style={styles.inputLabel}>
          {strings.otpVerification.inputLabel}
        </Text>

        <OTPInputView
          style={styles.otpInput}
          pinCount={6}
          autoFocusOnLoad
          codeInputFieldStyle={styles.inputFieldStyle}
          codeInputHighlightStyle={styles.inputFieldHighLighted}
          onCodeChanged={code => setOTP(code)}
        />

        <Spacer size={screenHeight * 0.06} />

        <View style={styles.footer}>
          <Text style={styles.footerNoteText}>
            {strings.otpVerification.footerNote}
          </Text>
          <Spacer size={3} horizontal />
          <TextButton
            label={strings.otpVerification.sendAgain}
            textStyle={styles.sendAgainButtonText}
            onPress={() => handleResendOTP()}
            progress={resendOtpLoading}
          />
        </View>

        <Spacer size={40} />
      </Scaffold>

      <Button
        text={strings.otpVerification.button}
        onPress={handleVerification}
        progress={loading}
      />
    </Screen>
  );
};

export default OTPVerification;
