import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import {checkLocationPermission} from './permission';

export const fetchCurrentLocation = async triggerFunc => {
  const isPermissionGranted = await checkLocationPermission();
  if (isPermissionGranted) {
    Geolocation.getCurrentPosition(
      position => {
        if (
          position &&
          position.coords &&
          position.coords.latitude &&
          position.coords.longitude
        ) {
          triggerFunc({
            latitude: position.coords.latitude.toFixed(4),
            longitude: position.coords.longitude.toFixed(4),
          });
        }
      },
      error => {
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  }
};

/**
 * Reverse geocodes coordinates into a GoogleAddress instance, which
 * will resolve from a Promise.
 *
 * @export
 * @param {string|number} latitude
 * @param {string|number} longitude
 * @return {Promise}
 */
export const geocode = (latitude, longitude) => {
  return new Promise(resolve => {
    return fetch(
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
        latitude +
        ',' +
        longitude +
        '&key=' +
        'AIzaSyB3hyMKgAjta9rl_R8KVIAHYQLBI2pKX3w',
      {
        method: 'get',
      },
    )
      .then(response => {
        console.log('Geo address => ' + JSON.stringify(response));
        const result = response?.data?.results[0];

        if (!result) {
          return resolve(null);
        }
        resolve(result);
      })
      .catch(error => {
        resolve(null);
      });
  });
};

/**
 * Reverse geocodes coordinates into a GoogleAddress instance, which
 * will resolve from a Promise.
 *
 * @export
 * @param {string|number} latitude
 * @param {string|number} longitude
 * @return {String|null}
 */
export const geoAddress = async (latitude, longitude) => {
  const res = await Geocoder.geocodePosition({
    lat: latitude,
    lng: longitude,
  });

  if (res && res.length && res[0].formattedAddress) {
    return res[0].formattedAddress;
  }
  return null;
};
