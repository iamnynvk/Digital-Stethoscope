import React, {forwardRef, useImperativeHandle} from 'react';
import {View, Text} from 'react-native';
import PropTypes from 'prop-types';
import WaveForm from 'react-native-audiowaveform';
import styles from './ExpandableView.styles';
import images from '@/assets/images';
import {Shimmer, Spacer, SvgIcon, Touchable} from '@/components';
import useStateRef from '@/hooks/useStateRef';
import {primaryBgColor, waveColor} from '@/theme/colors';
import {Menu, MenuItem} from 'react-native-material-menu';
import {strings} from '@/localization';
import {formattedSeconds} from '@/utils/date';
import {
  moderateScale,
  moderateVerticalScale,
  verticalScale,
} from '@/theme/scaling';
import {screenWidth} from '@/theme/spacing';

//Custom Component for the Expandable List
export const ExpandableView = forwardRef(
  (
    {
      item,
      selectedItem,
      isLoading,
      togglePlay,
      onShareButtonPress,
      onDeletePress,
      onItemPress,
    },
    ref,
  ) => {
    const [pause, setPause, pauseRef] = useStateRef(true);
    const [isMenuVisible, setMenuVisible, isMenuVisibleRef] =
      useStateRef(false);

    useImperativeHandle(ref, () => ({
      updateItem,
    }));

    const updateItem = () => {
      setPause(true);
    };

    return (
      <View>
        <Touchable
          onPress={() => {
            if (!pauseRef.current) {
              setPause(!pauseRef.current);
            }
            onItemPress();
          }}
          activeOpacity={1}>
          <View
            style={[
              styles.listItemContainer,
              {borderWidth: isLoading ? 0 : moderateScale(1)},
            ]}>
            <Shimmer
              style={isLoading && styles.shimIcon}
              isVisible={!isLoading}>
              <SvgIcon
                icon={images.ic_pulse}
                style={styles.pulseIcon}
                width={moderateScale(47, 0.24)}
                height={moderateScale(19, 0.24)}
              />
            </Shimmer>

            <View style={styles.flexOne}>
              <Shimmer
                style={isLoading && styles.shimTitle}
                isVisible={!isLoading}>
                {item && item.deviceValue && item.deviceValue.length && (
                  <Text
                    style={styles.fileTitle}
                    ellipsizeMode="tail"
                    numberOfLines={2}>
                    {item.deviceValue[0]?.name}
                  </Text>
                )}
              </Shimmer>

              <Shimmer
                style={isLoading && styles.shimDuration}
                isVisible={!isLoading}>
                {item &&
                  item.deviceValue &&
                  item.deviceValue.length &&
                  item.deviceValue[0].duration && (
                    <Text style={styles.fileDuration}>
                      {formattedSeconds(item.deviceValue[0]?.duration)}
                    </Text>
                  )}
              </Shimmer>
            </View>

            {!isLoading && (
              <Touchable
                onPress={() => {
                  setPause(!pauseRef.current);
                  togglePlay();
                }}>
                {pauseRef.current ? (
                  <SvgIcon
                    icon={images.ic_play_audio}
                    width={moderateScale(36, 0.24)}
                    height={moderateScale(36, 0.24)}
                    style={styles.playIcon}
                  />
                ) : (
                  <SvgIcon
                    icon={images.ic_stop}
                    width={moderateScale(36, 0.24)}
                    height={moderateScale(36, 0.24)}
                    style={styles.playIcon}
                  />
                )}
              </Touchable>
            )}

            <Spacer size={moderateScale(9, 0.2)} horizontal />

            <Menu
              visible={isMenuVisibleRef.current}
              onRequestClose={() => setMenuVisible(false)}>
              <MenuItem
                onPress={() => {
                  setMenuVisible(false);
                  onShareButtonPress();
                }}>
                {strings.home.share}
              </MenuItem>
              <MenuItem
                onPress={() => {
                  setMenuVisible(false);
                  onDeletePress();
                }}>
                {strings.home.delete}
              </MenuItem>
            </Menu>

            {!isLoading && (
              <Touchable
                onPress={() => {
                  setMenuVisible(true);
                }}>
                <SvgIcon
                  icon={images.ic_more_vertical}
                  width={moderateScale(16, 0.3)}
                  height={moderateScale(16, 0.3)}
                />
              </Touchable>
            )}

            <Spacer size={moderateScale(9)} horizontal />
          </View>
        </Touchable>

        <View
          style={{
            height:
              selectedItem == item &&
              item &&
              item.deviceValue &&
              item.deviceValue.length > 0
                ? null
                : 0,
            overflow: 'hidden',
            marginBottom: verticalScale(12),
          }}>
          {item && item.deviceValue && item.deviceValue.length > 0 && (
            <WaveForm
              style={styles.waveform}
              height={moderateVerticalScale(70)}
              waveFormStyle={{waveColor, scrubColor: primaryBgColor}}
              source={{uri: item.deviceValue[0]?.file}}
              play={!pauseRef.current && selectedItem == item ? true : false}
              stop={pauseRef.current && selectedItem == item ? true : false}
              onFinishPlay={() => setPause(!pauseRef.current)}
            />
          )}
        </View>
      </View>
    );
  },
);

ExpandableView.propTypes = {
  item: PropTypes.object,
  selectedItem: PropTypes.object,
  togglePlay: PropTypes.func,
  onItemPress: PropTypes.func,
};
