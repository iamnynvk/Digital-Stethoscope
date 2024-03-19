/**
 * Vitals Recorder module.
 */
import {NativeModules, NativeEventEmitter} from 'react-native';

const {HopsDevicesModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(HopsDevicesModule);

const AUDIO_FILTER_SERVER_URL = 'http://167.71.225.187:5010/upload';

export default {
  /**
   * Init the module.
   *
   * @param peripheralId The id/name/mac address of the peripheral to connect.
   */
  init: peripheralId => HopsDevicesModule.init(peripheralId),

  /**
   * Set server url for audio filter.
   *
   * Error code return : INVALID_AUDIO_FILTER_SERVER_URL
   * @returns {Promise<object>}
   */
  setAudioFilterUrl: () =>
    HopsDevicesModule.setAudioFilterServerURL(AUDIO_FILTER_SERVER_URL),

  /**
   * Start recording.
   *
   * @param seconds A maximum time duration to record audio. After max time duration EventGetCurrentAmplitudeValue listner give 'STOP_RECORDER_WITH_TIME' code
   * with filePath.
   */
  start: seconds => HopsDevicesModule.startRecording(seconds),

  /**
   * Stop recording. Returns a Promise object.
   *
   * Successful call completions return audio file path.
   *
   * Error code return in IOS platform :
   * BLE_NOT_SUPPORTED = 0,
   * BLE_NOT_ENABLED = 1,
   * BLE_PERMISSION_DENIED = 2,
   * DEVICE_DISCONNECTED = 4,
   * DEVICE_NOT_FOUND = 5,
   * DEVICE_STETHOSCOPE_NOT_SETUP = 7,
   * MICROPHONE_PERMISSION_DENIED = 8
   */
  stop: () => HopsDevicesModule.stopRecording(),

  /**
   * Set recording listener from native module for recorder.
   *
   * @param eventType Name of the event for which we are registering listener
   * @param listener Function to invoke when the specified event is emitted
   */
  addRecordingEventListener: listener =>
    eventEmitter.addListener('EventGetCurrentAmplitudeValue', listener),

  /**
   * Removes a listener created by the addRecordingEventListener.
   *
   * @param eventType  name of the event whose registered listeners to remove
   */
  removeRecordingEventListener: () =>
    eventEmitter.removeAllListeners('EventGetCurrentAmplitudeValue'),

  /**
   * Set message listener from native module for recorder.
   *
   * @param eventType Name of the event for which we are registering listener
   * @param listener Function to invoke when the specified event is emitted
   */
  addMessageEventListener: listener =>
    eventEmitter.addListener('EventStethoscopeRecordStartError', listener),

  /**
   * Removes a listener created by the addMessageEventListener.
   *
   * @param eventType  name of the event whose registered listeners to remove
   */
  removeMessageEventListener: () =>
    eventEmitter.removeAllListeners('EventStethoscopeRecordStartError'),
};
