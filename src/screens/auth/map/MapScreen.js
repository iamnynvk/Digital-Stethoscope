import React, {useRef, useState, useEffect} from 'react';
import {View} from 'react-native';
import {Screen, SvgIcon, Touchable} from '@/components';
import {styles} from './MapScreen.styles';
import Geocoder from 'react-native-geocoder';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import FastImage from 'react-native-fast-image';
import {FONT_MEDIUM} from '@/theme/typography';
import {screenWidth} from '@/theme/spacing';
import NavigationService from '@/navigation/NavigationService';
import images from '@/assets/images';
import {textColorGray, whiteColor} from '@/theme/colors';
import {strings} from '@/localization';

const latitudeDelta = 0.025;
const longitudeDelta = 0.025;

Geocoder.fallbackToGoogle('AIzaSyB3hyMKgAjta9rl_R8KVIAHYQLBI2pKX3w');

const MapScreen = props => {
  const region = props.route.params?.region;

  //states
  const [coordinate, setCoordinate] = useState(null);
  const [address, setAddress] = useState(null);
  const [widthOfMap, setWidthOfMap] = useState(screenWidth);
  const [loading, setLoading] = useState(true);

  //refs
  const mapRef = useRef();
  const placesRef = useRef();

  useEffect(() => {
    if (region) {
      setLoading(false);
      setCoordinate({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta,
        longitudeDelta,
      });
    }
  }, []);

  const Header = () => {
    return (
      <View style={styles.header}>
        <Touchable onPress={() => NavigationService.goBack()}>
          <SvgIcon icon={images.ic_back_arrow_white} />
        </Touchable>

        <View style={styles.flexOne} />

        <Touchable onPress={() => backAction()} style={{width: 30, height: 30}}>
          <SvgIcon icon={images.ic_select} size={30} />
        </Touchable>
      </View>
    );
  };

  const onRegionChange = async (region, {isGesture}) => {
    if (coordinate) {
      setCoordinate({
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: region.latitudeDelta,
        longitudeDelta: region.longitudeDelta,
      });

      try {
        const res = await Geocoder.geocodePosition({
          lat: region.latitude,
          lng: region.longitude,
        });

        if (res && res.length && res[0].formattedAddress) {
          placesRef.current?.setAddressText(res[0].formattedAddress);
          setAddress(res[0].formattedAddress);
        }
      } catch (err) {}
    }
  };

  const backAction = () => {
    NavigationService.goBack();
    if (coordinate && props.route.params && props.route.params.onGoBack) {
      props.route.params.onGoBack(coordinate, address);
    }
    return true;
  };

  return (
    <Screen style={styles.container}>
      <Header />

      {coordinate && (
        <View style={styles.markerFixed}>
          <FastImage style={styles.marker} source={images.ic_location_marker} />
        </View>
      )}

      <GooglePlacesAutocomplete
        placeholder={strings.mapScreen.searchLocation}
        fetchDetails
        ref={placesRef}
        onPress={(data, details = null) => {
          placesRef.current?.blur();
          if (details && details.geometry && details.geometry.location) {
            if (mapRef.current) {
              mapRef.current.animateToRegion(
                {
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                  latitudeDelta,
                  longitudeDelta,
                },
                1000,
              );
            }
            setTimeout(() => {
              setCoordinate({
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta,
                longitudeDelta,
              });
            }, 1000);
          }
        }}
        query={{
          key: 'AIzaSyB3hyMKgAjta9rl_R8KVIAHYQLBI2pKX3w',
        }}
        currentLocation
        enableHighAccuracyLocation
        enablePoweredByContainer={false}
        textInputProps={{
          clearButtonMode: 'always',
        }}
        renderLeftButton={() => (
          <SvgIcon
            icon={images.ic_search}
            width={20}
            height={20}
            color={textColorGray}
          />
        )}
        styles={{
          container: {
            alignSelf: 'center',
            width: screenWidth - 20,
            marginTop: 10,
            zIndex: 1,
          },
          textInputContainer: {
            height: 50,
            backgroundColor: whiteColor,
            paddingHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
          },
          textInput: {
            ...FONT_MEDIUM,
            ...{
              color: textColorGray,
              fontSize: 13,
              marginBottom: -2,
            },
          },
          // predefinedPlacesDescription: {
          //   ...FONT_MEDIUM,
          //   ...{
          //     color: textColorGray,
          //     fontSize: 13,
          //   },
          // },
          // description: {
          //   ...FONT_REGULAR,
          //   ...{
          //     color: textColorGray,
          //     fontSize: 13,
          //   },
          // },
          // listView: {
          //   maxHeight: '40%',
          // },
        }}
      />

      <MapView
        ref={mapRef}
        region={coordinate}
        style={[styles.map, {width: widthOfMap}]}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={onRegionChange}
        loadingEnabled={loading}
        zoomEnabled
        zoomTapEnabled
        zoomControlEnabled
        onMapReady={() => {
          setWidthOfMap(widthOfMap - 1);
        }}
        showsUserLocation
        onTouchStart={() => {
          placesRef.current?.isFocused ? placesRef.current?.blur() : null;
        }}
      />
    </Screen>
  );
};

export default MapScreen;
