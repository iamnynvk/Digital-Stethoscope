import React, {useCallback, useEffect, useRef} from 'react';
import {AppState, ScrollView} from 'react-native';
import {Screen, Spacer, ImageMapper, BackButton} from '@/components';
import images from '@/assets/images';
import {screenHeight} from '@/theme/spacing';
import {styles} from './RecordVitals.styles';
import {RecordVitalsModal} from '@/components/Modal/RecordVitalsModal';
import VitalsRecorder from '@/lib/VitalsRecorder';
import useStateRef from '@/hooks/useStateRef';
import {getFullName} from '@/utils/misc';
import {isAndroid} from '@/utils/platform';
import {isTablet} from 'react-native-device-detection';
import {BACK_HEART_MAP, FRONT_HEART_MAP} from '@/utils/maps';
import {showAsyncAlert, showToast} from '@/utils/info';
import {moderateVerticalScale} from '@/theme/scaling';
import {strings} from '@/localization';
import useAppIsActive from '@/hooks/useAppIsActive';

export const RecordAudio = props => {
  const user = props.route.params?.user;
  const recordVitalsModalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  const scrollRef = useRef();
  const [isInitialized, setInitialized, isInitializedRef] = useStateRef(false);
  const [initializedError, setInitializedError, initializedErrorRef] =
    useStateRef(null);
  const [deviceStatus, setDeviceStatus, deviceStatusRef] = useStateRef(null);

  const [reload, setReload, reloadRef] = useStateRef(false);

  const [selectedItem, setSelectedItem, selectedItemRef] = useStateRef(null);

  useEffect(() => {
    initializeRecorder();
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('beforeRemove', () => {
      if (props.route.params && props.route.params.onGoBack) {
        props.route.params.onGoBack(reloadRef.current);
      }
    });

    return () => unsubscribe();
  }, [props.navigation]);

  useEffect(() => {
    subscribeMessageListener();
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => {
      subscription?.remove();
      unSubscribeMessageListener();
    };
  }, []);

  useAppIsActive(() => requestRecorderModuleStatus());

  const requestRecorderModuleStatus = useCallback(() => {
    if (
      deviceStatusRef.current?.code != 'DEVICE_CONNECTED' &&
      !isInitializedRef.current
    ) {
      //initializeRecorder();
    }
  }, []);

  const initializeRecorder = async () => {
    if (isAndroid) {
      VitalsRecorder.init('Hops_Stetho')
        .then(() => {
          showToast('Device has been connected');
          setInitialized(true);
          setInitializedError(null);
          console.log('Module initialized');
        })
        .catch(error => {
          console.log('Module Initialize error ->');
          console.log(error);
          setInitialized(false);
          setInitializedError(error);
          if (error.shouldShowAlert) {
            handleAlert(error);
          }
        });
    } else {
      VitalsRecorder.init('Hops_Stetho');
      try {
        const result = await VitalsRecorder.setAudioFilterUrl();
        console.log(`setAudioFilterServerURL success : ${result} `);
      } catch (error) {
        console.log(`setAudioFilterServerURL error : ${error}`);
        showAsyncAlert('Error', String(error), [{text: strings.common.okay}]);
      }
    }
  };

  const handleAlert = error => {
    let buttons = [];
    let message = error.message;
    if (error.code == 'BLE_NOT_SUPPORTED') {
      buttons = [{text: 'OK', onPress: () => console.log('Ok press')}];
    } else {
      buttons = [
        {text: 'Retry', onPress: () => initializeRecorder()},
        {text: 'Cancel', onPress: () => Promise.resolve('no')},
      ];
      message = message + ' ' + strings.common.deviceConnectionError;
    }

    showAsyncAlert(null, message, buttons, {
      cancelable: true,
    });
  };

  const handleAppStateChange = nextAppState => {
    if (
      appStateRef.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      recordVitalsModalRef.current?.pauseAudio();
    }

    appStateRef.current = nextAppState;
  };

  const scrollTo = y => {
    scrollRef.current?.scrollTo({
      y,
      animated: true,
    });
  };

  const subscribeMessageListener = () => {
    VitalsRecorder.addMessageEventListener(message => {
      console.log('onMessage event rn : ', message);
      setDeviceStatus(message);
    });
  };

  const unSubscribeMessageListener = () => {
    VitalsRecorder.removeMessageEventListener();
  };

  return (
    <>
      <Screen style={styles.container}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          wrapperStyle={styles.scaffold}
          scrollContainerStyle={styles.scrollContainer}>
          <Spacer size={isAndroid ? 12 : 0} />
          <BackButton title={getFullName(user?.firstName, user?.lastName)} />
          {/* <Spacer size={12} /> */}
          <ImageMapper
            imgWidth={isTablet ? 300 : 280}
            imgHeight={isTablet ? 300 : 320}
            imgSource={images.ic_human_chest_front}
            imgMap={FRONT_HEART_MAP}
            containerStyle={styles.imageMapperContainer}
            onPress={item => {
              if (
                initializedErrorRef.current ||
                (deviceStatusRef.current?.code != 'DEVICE_CONNECTED' &&
                  deviceStatusRef.current?.code != 'DEVICE_STOP_RECODING' &&
                  isAndroid)
              ) {
                initializeRecorder();
              } else {
                setSelectedItem(item.id);
                recordVitalsModalRef.current?.openModal(
                  item.name,
                  user?.userId,
                );
              }
            }}
            selectedAreaId={selectedItemRef.current}
          />

          <Spacer size={isAndroid ? 12 : 0} />

          <ImageMapper
            imgWidth={isTablet ? 266 : 266}
            imgHeight={isTablet ? 266 : 320}
            imgSource={images.ic_human_chest_back}
            imgMap={BACK_HEART_MAP}
            containerStyle={styles.imageMapperContainer}
            onPress={item => {
              if (
                initializedErrorRef.current ||
                (deviceStatusRef.current?.code != 'DEVICE_CONNECTED' &&
                  deviceStatusRef.current?.code != 'DEVICE_STOP_RECODING' &&
                  isAndroid)
              ) {
                initializeRecorder();
              } else {
                setSelectedItem(item.id);
                setTimeout(() => scrollTo(screenHeight * 0.56), 50);
                recordVitalsModalRef.current?.openModal(
                  item.name,
                  user?.userId,
                );
              }
            }}
          />
          <Spacer
            size={
              selectedItemRef.current
                ? screenHeight
                : moderateVerticalScale(40, 2)
            }
          />
        </ScrollView>
      </Screen>
      <RecordVitalsModal
        ref={recordVitalsModalRef}
        uploadingFile={() => setReload(true)}
        onCloseModal={() => {
          scrollTo(0);
          setSelectedItem(null);
        }}
        deviceStatus={deviceStatusRef.current}
      />
    </>
  );
};
