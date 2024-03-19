import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useContext,
} from 'react';
import {Text, View, StyleSheet, Keyboard} from 'react-native';
import {SvgIcon, Touchable, Modal, FloatingActionButton} from '@/components';
import PropTypes from 'prop-types';
import VitalsRecorder from '@/lib/VitalsRecorder';
import {Canvas} from '../Canvas';
import WaveForm from 'react-native-audiowaveform';
import useStateRef from '@/hooks/useStateRef';
import images from '@/assets/images';
import {FONT_MEDIUM} from '@/theme/typography';
import {screenHeight} from '@/theme/spacing';
import {
  audioListBorderColor,
  buttonBgColor,
  stopRecordingButtonBgColor,
  textColorBlack,
  textColorPrimary,
  primaryBgColor,
  waveColor,
} from '@/theme/colors';
import {storage} from '@/utils/storage';
import {PREFERENCES} from '@/constants';
import {AuthContext} from '@/navigation/AuthProvider';

import {showToast} from '@/utils/info';
import {getCurrentDate} from '@/utils/date';
import {SaveFileDialog} from '../Dialog/SaveFileDialog';
import {getAuthUserId, uploadFile, removeVitalsFile} from '@/utils/firebase';

let amplitudeData = [];
let interval = null;
const recordingTimeLimit = 15;

export const RecordVitalsModal = forwardRef((props, ref) => {
  const {uploadingFile, onCloseModal, deviceStatus} = props;

  //refs
  const modalRef = useRef();
  const canvasRef = useRef();

  //states
  const [title, setTitle, titleRef] = useStateRef('');
  const [userId, setUserId, userIdRef] = useStateRef(null);
  const [isRecording, setIsRecording, isRecordingRef] = useStateRef(false);
  const [recordedFile, setRecordedFile, recordedFileRef] = useStateRef(null);
  const [pause, setPause, pauseRef] = useStateRef(true);
  const [isDialogVisible, setIsDialogVisible, isDialogVisibleRef] =
    useStateRef(false);
  const [timerSeconds, setTimerSeconds, timerSecondsRef] = useStateRef(0);
  const [isTimerActive, setTimerActive, isTimerActiveRef] = useStateRef(false);
  const [uploadedFile, setUploadedFile, uploadedFileRef] = useStateRef(null);

  // for Voice Gain
  const [gain, setGain] = useState(200);

  useImperativeHandle(ref, () => ({
    openModal(title, userId) {
      if (modalRef.current) {
        setTitle(title);
        setUserId(userId);
        Keyboard.dismiss();
        modalRef.current.openModal();
        resetRecorderState();
      }
    },
    closeModal() {
      if (modalRef.current) {
        modalRef.current.closeModal();
      }
    },
    pauseAudio() {
      if (modalRef.current) {
        setPause(true);
      }
    },
  }));

  useEffect(() => {
    fatchingValue();
  }, []);

  // voice gain set here using context
  const context = useContext(AuthContext);

  useEffect(() => {
    setGain(context.getGain);
  }, [context.getGain]);
  // -------------------

  // voice gain here using get preference (currently not use)
  const fatchingValue = async () => {
    try {
      const value = await storage.get(PREFERENCES.GAIN);
      console.log('this is get Value of Preference :', value);
      value.data && setGain(value.data);
    } catch (err) {
      console.log(
        'this is fatching error to get preference of Voice gain :',
        err,
      );
    }
  };
  console.log(gain);
  // --------------------------------------------------------------

  useEffect(() => {
    if (isTimerActiveRef.current) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds + 1);
      }, 1000);
    } else if (!isTimerActiveRef.current && timerSecondsRef.current !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerActiveRef.current, timerSecondsRef.current]);

  const resetTimer = () => {
    setTimerSeconds(0);
    setTimerActive(false);
  };

  const onStartRecord = async () => {
    console.log(deviceStatus);
    if (
      deviceStatus?.code == 'DEVICE_CONNECTED' ||
      deviceStatus?.code == 'DEVICE_STOP_RECODING'
    ) {
      VitalsRecorder.start(
        recordingTimeLimit,
        gain,
        file => {
          console.log(`onStartRecord file  ->`);

          console.log(file);
          try {
            setRecordedFile(file);
            setIsDialogVisible(!isDialogVisibleRef.current);
          } catch (error) {
            console.log(`onStartRecord error found ->` + error);
          } finally {
            resetCanvas();
          }
        },
        error => {
          console.log('onStartRecord error found ->' + error);
          resetCanvas();
        },
      );
      VitalsRecorder.addRecordEventListener(e => {
        amplitudeData.push((e.currentMetering / 32767) * 1000);
        canvasRef.current?.update(amplitudeData);
      });

      setTimerActive(!timerSecondsRef.current);
      setIsRecording(!isRecordingRef.current);
    } else {
      showToast(
        `Make sure you're connected to device and try again.(${deviceStatus.code})`,
      );
    }
  };

  const onStopRecord = async () => {
    if (isRecordingRef.current) {
      try {
        await VitalsRecorder.stop();
      } catch (error) {
        console.log(`onStopRecord error found -> ` + error);
      }
    }
    VitalsRecorder.removeRecordEventListener();
  };

  const handleOnCloseModalSheet = () => {
    if (isRecordingRef.current) {
      onStopRecord();
    } else {
      resetRecorderState();
    }
    onCloseModal && onCloseModal();
  };

  const resetCanvas = () => {
    setIsRecording(false);
    resetTimer();
    amplitudeData = [];
    setPause(true);
  };

  const resetRecorderState = async () => {
    setIsRecording(false);
    setRecordedFile(null);
    setPause(true);
    amplitudeData = [];
    resetTimer();
  };

  return (
    <>
      <Modal
        ref={modalRef}
        adjustToContentHeight
        panGestureEnabled
        disableScrollIfPossible
        withHandle
        closeOnOverlayTap
        overlayStyle={styles.overlay}
        onOverlayPress={() => handleOnCloseModalSheet()}
        onClose={() => handleOnCloseModalSheet()}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleStyle}>{titleRef.current}</Text>
          <View style={styles.flexOne} />
          {uploadedFileRef.current && (
            <Touchable
              onPress={() =>
                removeVitalsFile(
                  uploadedFileRef.current.vitalId,
                  getAuthUserId(),
                  uploadedFileRef.current.deviceValue[0].fileName,
                  uploadedFileRef.current.deviceValue[0].fileType,
                )
              }>
              <SvgIcon icon={images.ic_delete} />
            </Touchable>
          )}
        </View>
        <Text style={styles.subTitle}>
          {getCurrentDate('DD/MM/YYYY | HH:mm')}
        </Text>

        <View style={styles.recordingTimeContainer}>
          <Text style={styles.timerText}>
            {`00:` +
              `${
                timerSecondsRef.current < 10
                  ? '0' + timerSecondsRef.current
                  : timerSecondsRef.current
              }`}
          </Text>
          <View style={styles.flexOne} />
          <Text style={styles.timerText}>00:{recordingTimeLimit}</Text>
        </View>

        <View style={styles.canvasContainer} pointerEvents="none">
          {recordedFileRef.current ? (
            <WaveForm
              style={{flex: 1}}
              waveFormStyle={{waveColor, scrubColor: primaryBgColor}}
              source={{uri: recordedFileRef.current?.filePath}}
              play={!pauseRef.current}
              stop={pauseRef.current}
              onFinishPlay={() => setPause(!pauseRef.current)}
            />
          ) : (
            <Canvas ref={canvasRef} />
          )}
        </View>

        <View style={styles.footerBtnContainer}>
          <FloatingActionButton
            size={84}
            Icon={SvgIcon}
            wrapperStyle={{
              backgroundColor: isRecordingRef.current
                ? stopRecordingButtonBgColor
                : buttonBgColor,
            }}
            logo={
              recordedFileRef.current
                ? pauseRef.current
                  ? images.ic_vitals_play
                  : images.ic_vitals_pause
                : isRecordingRef.current
                ? images.ic_stop
                : images.ic_microphone
            }
            onPress={() =>
              recordedFileRef.current
                ? setPause(!pauseRef.current)
                : !isRecordingRef.current
                ? onStartRecord()
                : onStopRecord()
            }
          />
        </View>
      </Modal>
      <SaveFileDialog
        isVisible={isDialogVisibleRef.current}
        closeModal={() => setIsDialogVisible(!isDialogVisibleRef.current)}
        onPositiveButtonPress={async () => {
          setIsDialogVisible(!isDialogVisibleRef.current);
          uploadingFile && uploadingFile();
          const result = await uploadFile(userIdRef.current, {
            file: recordedFileRef.current?.filePath,
            name: titleRef.current,
            duration: recordedFileRef.current?.fileDuration,
          });
          setUploadedFile(result);

          console.log(result);
          onCloseModal && onCloseModal();
        }}
        onNegativeButtonPress={() => {
          setIsDialogVisible(!isDialogVisibleRef.current);
          //Remove local temp file code if required
          resetRecorderState();
        }}
      />
    </>
  );
});

RecordVitalsModal.propTypes = {
  openDialog: PropTypes.func,
};

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 20,
  },
  titleStyle: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 24,
      color: textColorBlack,
    },
  },
  subTitle: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 17,
      color: textColorPrimary,
      marginHorizontal: 20,
      marginTop: 1,
    },
  },
  flexOne: {
    flex: 1,
  },
  recordingTimeContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginHorizontal: 20,
  },
  timerText: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 14,
      color: textColorBlack,
    },
  },
  canvasContainer: {
    height: screenHeight * 0.16,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: audioListBorderColor,
    marginTop: 8,
    backgroundColor: '#f6f6f6',
  },
  footerBtnContainer: {
    alignSelf: 'center',
    marginVertical: 42,
  },
  slider: {
    height: 30,
    marginLeft: 7,
    width: '100%',
  },
});
