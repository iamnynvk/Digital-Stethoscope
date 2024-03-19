import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {isAndroid} from '@/utils/platform';
import Onboarding from '@/screens/onboarding/Onboarding';
import {NAVIGATION} from '@/constants';
import Login from '@/screens/auth/login/Login';
import OTPVerification from '@/screens/auth/otp_verification/OTPVerification';
import UpdateProfile from '@/screens/auth/update_profile/UpdateProfile';
import AddMember from '@/screens/auth/add_member/AddMember';
import WebScreen from '@/screens/webscreen/WebScreen';
import MapScreen from '@/screens/auth/map/MapScreen';

const Stack = createNativeStackNavigator();

export function AuthNavigator(props) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        presentation: isAndroid ? 'transparentModal' : 'card',
      }}
      initialRouteName={props.initialRoute}>
      <Stack.Screen
        component={Onboarding}
        name={NAVIGATION.ONBOARDING}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={Login}
        name={NAVIGATION.LOGIN}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={OTPVerification}
        name={NAVIGATION.OTP_VERIFICATION}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={UpdateProfile}
        name={NAVIGATION.REGISTER_USER_DETAIL}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={AddMember}
        name={NAVIGATION.ADD_MEMBER}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={WebScreen}
        name={NAVIGATION.WEB_SCREEN}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={MapScreen}
        name={NAVIGATION.MAP}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
