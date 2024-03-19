import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {getAuthSubscriber} from '@/utils/firebase';
import {AuthNavigator} from './AuthNavigator';
import {AppNavigator} from './AppNavigator';
import useStateRef from '@/hooks/useStateRef';
import useAuth from '@/hooks/useAuth';
import SplashScreen from 'react-native-splash-screen';
import NavigationService from './NavigationService';
import {primaryBgColor, whiteColor} from '@/theme/colors';
import {StatusBar} from 'react-native';
import {ToastMessage} from '@/components';
import {storage} from '@/utils/storage';
import {NAVIGATION, PREFERENCES} from '@/constants';

export default function Routes() {
  const {authUser, setAuthUser} = useAuth();
  const [initializing, setInitializing, initializingRef] = useStateRef(true);
  const [initialRouteName, setInitialRouteName, initialRouteNameRef] =
    useStateRef(NAVIGATION.LOGIN);

  /**
   * Listen for changes in the users auth state (logging in and out).
   * Once subscribed, the 'user' parameter will either be null
   * (logged out) or an Object (logged in)
   */
  useEffect(() => {
    const authSubscription = getAuthSubscriber(onAuthStateChanged);
    return authSubscription;
  }, []);

  useEffect(() => {
    retriveUserData();
  }, []);

  // Handle user state changes
  const onAuthStateChanged = user => {
    if (!user) {
      setAuthUser(null);
    }
  };

  const retriveUserData = async () => {
    const isFirstTimeRun = await checkFirstRun();
    if (isFirstTimeRun) {
      setInitialRouteName(NAVIGATION.ONBOARDING);
      await storage.set(PREFERENCES.FIRST_RUN, '1');
    }
    const {data} = await storage.get(PREFERENCES.USER);
    setInitializing(false);
    setAuthUser(data);
    setTimeout(
      () => {
        SplashScreen.hide();
      },
      authUser ? 200 : 2400,
    );
  };

  const checkFirstRun = async () => {
    const {data} = await storage.get(PREFERENCES.FIRST_RUN);
    return data ? false : true;
  };

  if (initializingRef.current) {
    return null;
    //return <Loading />;
  }

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={() => {
        NavigationService.isReadyRef.current = true;
        NavigationService.routeNameRef.current =
          NavigationService.navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={() => {
        const currentRouteName =
          NavigationService.navigationRef.current.getCurrentRoute().name;
        NavigationService.routeNameRef.current = currentRouteName;
      }}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={authUser?.email ? primaryBgColor : whiteColor}
      />
      {authUser?.email ? (
        <AppNavigator />
      ) : (
        <AuthNavigator initialRoute={initialRouteNameRef.current} />
      )}
      <ToastMessage />
    </NavigationContainer>
  );
}
