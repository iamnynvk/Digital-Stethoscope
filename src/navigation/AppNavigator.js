import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '@/screens/dashboard/home/Home';
import {NAVIGATION} from '@/constants';
import {RecordAudio} from '@/screens/dashboard/record_vitals/RecordVitals';
import Profile from '@/screens/dashboard/profile/Profile';
import {isAndroid} from '@/utils/platform';
import ViewAllFile from '@/screens/dashboard/home/ViewAllFile';
import AddMember from '@/screens/auth/add_member/AddMember';
import UpdateProfile from '@/screens/auth/update_profile/UpdateProfile';
import MapScreen from '@/screens/auth/map/MapScreen';
import Setting from '@/screens/dashboard/home/setting/Setting';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        presentation: isAndroid ? 'transparentModal' : 'card',
      }}>
      <Stack.Screen
        component={Home}
        name={NAVIGATION.HOME}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={RecordAudio}
        name={NAVIGATION.RECORD_VITALS}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={Profile}
        name={NAVIGATION.PROFILE}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={ViewAllFile}
        name={NAVIGATION.VIEW_ALL_FILE}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={UpdateProfile}
        name={NAVIGATION.UPDATE_PROFILE}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={AddMember}
        name={NAVIGATION.ADD_MEMBER}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={MapScreen}
        name={NAVIGATION.MAP}
        options={{headerShown: false}}
      />
      <Stack.Screen
        component={Setting}
        name={NAVIGATION.SETTING}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}
