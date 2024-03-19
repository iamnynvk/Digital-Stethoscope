import React from 'react';
import {Dimensions, PixelRatio, View} from 'react-native';
import styles from './styles';
import {Touchable} from '@/components/TouchableItem';
import {SvgIcon} from '@/components/SvgIcon';
import FastImage from 'react-native-fast-image';

export const ImageMapper = props => {
  const {
    imgHeight,
    imgWidth,
    imgSource,
    imgMap,
    containerStyle,
    selectedAreaId,
    onPress,
  } = props;

  const buildStyle = (item, index) => {
    const {x1, y1, fill, prefill, id} = item;
    const style = {
      position: 'absolute',
      width: 0,
      height: 0,
      left: getResponsiveWidth(x1),
      top: getResponsiveHeight(y1),
      zIndex: 100,
    };
    if (fill !== null && fill !== undefined) {
      if (id === selectedAreaId) {
        style.backgroundColor = fill;
      }
    }

    return style;
  };

  const buildColor = (item, index) => {
    const {fill, prefill, id} = item;
    if (fill !== null && fill !== undefined) {
      if (id === selectedAreaId) {
        return fill;
      }
    }
    return '';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <FastImage
        style={{
          width: getResponsiveWidth(imgWidth),
          height: getResponsiveHeight(imgHeight),
          alignSelf: 'center',
        }}
        source={imgSource}
        resizeMode={FastImage.resizeMode.contain}
      />
      {imgMap &&
        imgMap?.map((item, index) => (
          <Touchable
            key={item.id}
            onPress={event => onPress && onPress(item, index, event)}
            style={buildStyle(item, index)}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <SvgIcon
              icon={item.image}
              color={buildColor(item, index)}
              width={getResponsiveWidth(item.width)}
              height={getResponsiveHeight(item.height)}
            />
          </Touchable>
        ))}
    </View>
  );
};

const defaultWidth = 360;
const defaultHeight = 640;
const appScreen = Dimensions.get('window');

const getResponsiveWidth = width => {
  const ratio = (width / defaultWidth) * 100;
  const responsiveWidth = getResponsiveValue('WIDTH', ratio);
  return responsiveWidth;
};

const getResponsiveHeight = height => {
  const ratio = (height / defaultHeight) * 100;
  const responsiveHeight = getResponsiveValue('HEIGHT', ratio);
  return responsiveHeight;
};

export const getResponsiveValue = (type, ratio = null) => {
  let screenValue;
  if (type === 'WIDTH') {
    screenValue = appScreen.width;
  } else if (type === 'HEIGHT') {
    screenValue = appScreen.height;
  }
  return PixelRatio.roundToNearestPixel((screenValue * ratio) / 100);
};
