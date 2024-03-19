import {Alert} from 'react-native';
import {
  check,
  request,
  RESULTS,
  requestMultiple,
  checkMultiple,
} from 'react-native-permissions';
import {PERMISSION} from '@/constants/permissions';
import {openSettings} from 'react-native-permissions';

export const checkPermissionAndRequest = (permission, callback = null) => {
  check(permission)
    .then(result => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'This feature is not available (on this device / in this context)',
          );
          break;
        case RESULTS.DENIED:
          console.log(
            'The permission has not been requested / is denied but requestable',
          );
          requestPermission(permission, callback);
          break;
        case RESULTS.GRANTED:
          callback && callback(RESULTS.GRANTED);
          break;
        case RESULTS.BLOCKED:
          console.log('The permission is denied and not requestable anymore');
          callback && callback(RESULTS.BLOCKED);
          break;
        case RESULTS.LIMITED:
          callback && callback(RESULTS.LIMITED);
          break;
      }
    })
    .catch(e => {
      console.log(e);
    });
};

export const requestPermission = (permission, callback = null) => {
  request(permission)
    .then(result => {
      switch (result) {
        case RESULTS.GRANTED:
          callback && callback(RESULTS.GRANTED);
          break;
        case RESULTS.BLOCKED:
          callback && callback(RESULTS.BLOCKED);
          break;
      }
    })
    .catch(e => {
      console.log(e);
    });
};

// Check a single permission
export const checkPermission = async permission => {
  let isPermissionGranted = false;
  const result = await check(permission);
  switch (result) {
    case RESULTS.GRANTED:
      isPermissionGranted = true;
      break;
    case RESULTS.DENIED:
      isPermissionGranted = false;
      break;
    case RESULTS.BLOCKED:
      isPermissionGranted = false;
      break;
    case RESULTS.UNAVAILABLE:
      isPermissionGranted = false;
      break;
  }
  return isPermissionGranted;
};

//Checks for Multiple permissions
export const checkMultiplePermissions = async permissions => {
  let isPermissionGranted = false;

  const statuses = await checkMultiple(permissions);
  for (var index in permissions) {
    if (statuses[permissions[index]] === RESULTS.GRANTED) {
      isPermissionGranted = true;
    } else {
      isPermissionGranted = false;
      break;
    }
  }
  return isPermissionGranted;
};

export const checkMultiplePermissionsAndRequest = async permissions => {
  let isPermissionGranted = false;
  const statuses = await requestMultiple(permissions);
  for (var index in permissions) {
    if (statuses[permissions[index]] === RESULTS.GRANTED) {
      isPermissionGranted = true;
    } else {
      isPermissionGranted = false;
      break;
    }
  }
  return isPermissionGranted;
};

// Requesting for the Location permission
export const checkLocationPermission = async () => {
  const isPermissionGranted = await checkMultiplePermissionsAndRequest(
    PERMISSION.LOCATION_PERMISSION,
  );
  if (!isPermissionGranted) {
    openSettingModal(
      'Permission Alert',
      'You have disabled location permission. You can grant it in the application settings.',
      'App Settings',
      'Cancel',
    );
  }
  return isPermissionGranted;
};

const openSettingModal = (
  title,
  messageBody,
  positiveButton,
  negativeButton,
) => {
  Alert.alert(
    title,
    messageBody,
    [
      {
        text: negativeButton,
        style: 'cancel',
      },
      {
        text: positiveButton,
        onPress: () =>
          openSettings().catch(() => console.warn('cannot open settings')),
      },
    ],
    {cancelable: false},
  );
};
