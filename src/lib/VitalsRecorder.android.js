/**
 * Vitals Recorder module.
 */
import {NativeModules, NativeEventEmitter} from 'react-native';

const {HopsDevicesModule} = NativeModules;
const eventEmitter = new NativeEventEmitter(HopsDevicesModule);

export default {
  /**
   * Init the module.
   *
   * @param peripheralId The id/name/mac address of the peripheral to connect.
   * @returns {Promise<object>}
   */
  init: peripheralId => {
    return new Promise((fulfill, reject) => {
      HopsDevicesModule.init(peripheralId, error => {
        if (error != null) {
          reject(error);
        } else {
          fulfill();
        }
      });
    });
  },

  /**
   * Start recording.
   *
   * @param seconds A maximum time duration to record audio.
   * @param successCallback
   * @param errorCallback
   */
  start: (seconds, gain, successCallback, errorCallback) =>
    HopsDevicesModule.startRecording(
      seconds,
      gain,
      successCallback,
      errorCallback,
    ),

  /**
   * Stop recording.
   *
   * @returns {void}
   */
  stop: () => HopsDevicesModule.stopRecording(),

  /**
   * Set recording listener from native module for recorder.
   *
   * @param listener Function to invoke when the specified event is emitted
   * @returns {callBack(e: any)}
   */
  addRecordEventListener: listener =>
    eventEmitter.addListener('RecordEvent', listener),

  /**
   * Removes a listener created by the addRecordEventListener.
   *
   * @returns {void}
   */
  removeRecordEventListener: () =>
    eventEmitter.removeAllListeners('RecordEvent'),

  /**
   * Set message listener from native module for recorder.
   *
   * @param listener Function to invoke when the specified event is emitted
   * @returns {callBack(e: any)}
   */
  addMessageEventListener: listener =>
    eventEmitter.addListener('MessageEvent', listener),

  /**
   * Removes a listener created by the addMessageEventListener.
   *
   * @returns {void}
   */
  removeMessageEventListener: () =>
    eventEmitter.removeAllListeners('MessageEvent'),
};
