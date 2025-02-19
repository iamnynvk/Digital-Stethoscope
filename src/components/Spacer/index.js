import React from 'react';
import {View} from 'react-native';

export const Spacer = ({size, horizontal = false}) => {
  const horizontalStyle = {
    width: size,
  };
  const verticalStyle = {
    height: size,
  };
  return <View style={horizontal ? horizontalStyle : verticalStyle} />;
};
