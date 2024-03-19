import React, {useRef, forwardRef, useImperativeHandle, useEffect} from 'react';
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

import {showAsyncAlert} from '@/utils/info';
import {getCurrentDate} from '@/utils/date';
import {SaveFileDialog} from '../Dialog/SaveFileDialog';
import {getAuthUserId, uploadFile, removeVitalsFile} from '@/utils/firebase';
import {strings} from '@/localization';

let amplitudeData = [];
let interval = null;
const recordingTimeLimit = 15;

export const RecordVitalsModal = forwardRef((props, ref) => {
  const {uploadingFile, onCloseModal} = props;

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

  useImperativeHandle(ref, () => ({
    openModal(title, userId) {
      if (modalRef.current) {
        setTitle(title);
        setUserId(userId);
        console.log(userId);
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
    VitalsRecorder.addRecordingEventListener(onSessionConnected);
    VitalsRecorder.addMessageEventListener(onErrorOccurred);
    return () => {
      VitalsRecorder.removeRecordingEventListener();
      VitalsRecorder.removeMessageEventListener();
    };
  }, []);

  useEffect(() => {
    if (isTimerActiveRef.current) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds + 1);
        // if (timerSecondsRef.current == 15) {
        //   clearInterval(interval);
        //   onStopRecord();
        // }
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

  const onSessionConnected = event => {
    console.log('onSessionConnected : ', event);
    amplitudeData.push(event.amplitude * 1000);
    canvasRef.current?.update(amplitudeData);
  };

  const onErrorOccurred = error => {
    console.log('onErrorOccurred : ', error);
    if (error.error_code === 'STOP_RECORDER_WITH_TIME') {
      console.log(`onErrorOccurred File ${error.data.filePath} returned`);
      if (isRecordingRef.current) {
        clearInterval(interval);
        setRecordedFile({
          filePath: error.data.filePath,
          fileDurationInSeconds: recordingTimeLimit,
        });
        setIsDialogVisible(!isDialogVisibleRef.current);
        resetCanvas();
      }
    } else {
      setRecordedFile(null);
      resetCanvas();
      showAsyncAlert('Error', error.error_code, [{text: strings.common.okay}]);
    }
  };

  const onStartRecord = async () => {
    VitalsRecorder.start(recordingTimeLimit);
    setTimerActive(!timerSecondsRef.current);
    setIsRecording(!isRecordingRef.current);
  };

  const onStopRecord = async () => {
    if (isRecordingRef.current) {
      try {
        const file = await VitalsRecorder.stop();
        console.log(`onStopRecord File ${file.filePath} returned`);
        setRecordedFile(file);
        setIsDialogVisible(!isDialogVisibleRef.current);
      } catch (error) {
        console.log(`onStopRecord error found! ${error}`);
      } finally {
        resetCanvas();
      }
    }
  };

  const resetCanvas = () => {
    setIsRecording(!isRecordingRef.current);
    resetTimer();
    amplitudeData = [];
    setPause(true);
  };

  const resetRecorderState = async () => {
    setIsRecording(false);
    setRecordedFile(null);
    setPause(true);
    amplitudeData = [];
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
        onOverlayPress={() => {
          if (isRecordingRef.current) {
            onStopRecord();
          } else {
            resetRecorderState();
          }
        }}
        onClose={() => {
          if (isRecordingRef.current) {
            onStopRecord();
          } else {
            resetRecorderState();
          }
          onCloseModal && onCloseModal();
        }}>
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
          // handleUploadFile();
          const result = await uploadFile(userIdRef.current, {
            file: recordedFileRef.current?.filePath,
            name: titleRef.current,
            duration: recordedFileRef.current?.fileDurationInSeconds,
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
