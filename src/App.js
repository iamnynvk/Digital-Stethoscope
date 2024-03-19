import React from 'react';
import {Text, TextInput, LogBox} from 'react-native';
import Providers from './navigation';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'componentWillMount has been renamed, and is not recommended for use. See https://reactjs.org/link/unsafe-component-lifecycles for details.',
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
]);

Text.defaultProps = {
  ...(Text.defaultProps || {}),
  allowFontScaling: false,
};
TextInput.defaultProps = {
  ...(TextInput.defaultProps || {}),
  allowFontScaling: false,
};

const App = () => {
  return <Providers />;
};

export default App;
