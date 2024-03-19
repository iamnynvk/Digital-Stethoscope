import React, {createContext, useState} from 'react';
import NavigationService from './NavigationService';
import {showAsyncAlert, showToast} from '@/utils/info';
import {storage} from '@/utils/storage';
import {NAVIGATION} from '@/constants';
import {PREFERENCES} from '@/constants';
import {
  removeUserDetails,
  getUserDetails,
  handleAuthError,
  logoutUser,
  otpVerification,
  setUpNewUser,
  signInWithPhoneNumber,
  updateUserDetails,
  getAuthUserId,
  linkAccountWithEmail,
} from '@/utils/firebase';
import useStateRef from '@/hooks/useStateRef';
import {strings} from '@/localization';

export const AuthContext = createContext({});

/**
 * This provider is created to access user in whole app.
 */
export const AuthProvider = ({children}) => {
  const [authUser, setAuthUser, authUserRef] = useStateRef(null);

  const [getGain, setGetGain] = useState(200);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        getGain,
        setGetGain,
        login: async (countryCode, phoneNumber) => {
          try {
            const confirmation = await signInWithPhoneNumber(
              '+' + countryCode + phoneNumber,
            );
            NavigationService.navigate(NAVIGATION.OTP_VERIFICATION, {
              countryCode,
              phoneNumber,
              confirmation,
            });
          } catch (e) {
            handleAuthError(e, message => {
              showToast(message);
            });
          }
        },
        otpVerification: async (
          confirmation,
          countryCode,
          phoneNumber,
          otp,
        ) => {
          try {
            await otpVerification(confirmation, otp);
            const user = await getUserDetails(getAuthUserId());
            if (user && user.status && user.status != 'active') {
              showAsyncAlert(null, strings.common.disabledAccountMessage, [
                {text: strings.common.okay},
              ]);
            } else if (user && user.email) {
              storage.set(PREFERENCES.USER, user);
              setAuthUser(user);
            } else {
              NavigationService.replace(NAVIGATION.REGISTER_USER_DETAIL, {
                countryCode,
                phoneNumber,
              });
            }
          } catch (e) {
            handleAuthError(e, message => {
              showToast(message);
            });
          }
        },
        resendOTP: async (countryCode, phoneNumber) => {
          try {
            const confirmation = await signInWithPhoneNumber(
              '+' + countryCode + phoneNumber,
              true,
            );
            return confirmation;
          } catch (e) {
            handleAuthError(e, message => {
              showToast(message);
            });
          }
        },
        registerUserDetail: async user => {
          try {
            await linkAccountWithEmail(user.email, user.phoneNumber);
            await updateUserDetails(user.userId, user);
            storage.set(PREFERENCES.USER, user);
            setAuthUser(user);
          } catch (e) {
            handleAuthError(e, message => {
              showToast(message);
            });
          }
        },
        updateUserProfile: async (userId, updatedUserInfo) => {
          try {
            await updateUserDetails(userId, updatedUserInfo);
            setAuthUser({...authUser, ...updatedUserInfo});
            storage.set(PREFERENCES.USER, {...authUser, ...updatedUserInfo});
            return true;
          } catch (e) {
            handleAuthError(e, message => {
              showToast(message);
            });
            return false;
          }
        },
        addMember: async (refId, user) => {
          try {
            await setUpNewUser(refId, user);
          } catch (e) {
            handleAuthError(e, message => {
              showToast(message);
            });
          }
        },
        updateMemberInfo: async (userId, user) => {
          try {
            await updateUserDetails(userId, user);
          } catch (e) {
            showToast(e.message);
          }
        },
        deleteMemberInfo: async userId => {
          try {
            await removeUserDetails(userId);
            return true;
          } catch (e) {
            showToast(e.message);
            return false;
          }
        },
        logout: async () => {
          try {
            await logoutUser();
            storage.remove(PREFERENCES.USER);
          } catch (e) {
            showToast(e.message);
          }
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
