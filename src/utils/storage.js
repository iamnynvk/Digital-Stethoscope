import AsyncStorage from '@react-native-async-storage/async-storage';
import {parse, serialize, withData} from './misc';

/**
 * Storage utility functions.
 */
export const storage = {
  /**
   * Retrieves an element from storage.
   *
   * @export
   * @param {string} key
   * @return {*}
   */
  async get(key) {
    const data = (await AsyncStorage.getItem(key)) || '';
    return parse(data);
  },

  /**
   * Sets an element to storage.
   *
   * @export
   * @param {string} key
   * @param {*} value
   * @return {*}
   */
  set(key, value) {
    return withData(AsyncStorage.setItem(key, serialize(value)));
  },

  /**
   * Removes an item from storage.
   *
   * @export
   * @param {string} key
   * @return {void}
   */
  remove(key) {
    return AsyncStorage.removeItem(key);
  },
};
