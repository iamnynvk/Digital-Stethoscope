import React, {useRef} from 'react';
import {Text, View} from 'react-native';
import {styles} from '@/screens/onboarding/Onboarding.styles';
import {Button, Screen, Spacer, SvgIcon, TextButton} from '@/components';
import Dots from 'react-native-dots-pagination';
import PagerView from 'react-native-pager-view';
import {strings} from '@/localization';
import images from '@/assets/images';
import useStateRef from '@/hooks/useStateRef';
import {sliderActiveDotBgColor, sliderPassiveDotBgColor} from '@/theme/colors';
import NavigationService from '@/navigation/NavigationService';
import {NAVIGATION} from '@/constants';
import {isAndroid} from '@/utils/platform';
import {useBackHandler} from '@/hooks/useBackHandler';
import {screenHeight, screenWidth} from '@/theme/spacing';
import FastImage from 'react-native-fast-image';

const Onboarding = () => {
  const pagerViewRef = useRef(null);
  const [sliderPosition, setSliderPosition, sliderPositionRef] = useStateRef(0);

  useBackHandler(() => {
    if (sliderPositionRef.current != 0) {
      pagerViewRef.current?.setPage(sliderPositionRef.current - 1);
      setSliderPosition(sliderPositionRef.current - 1);
      return true;
    }

    return false;
  });

  return (
    <Screen>
      <TextButton
        label={sliderPositionRef.current !== 1 ? strings.common.skip : ' '}
        textStyle={styles.textButtonStyle}
        style={styles.textButtonContainer}
        onPress={() =>
          sliderPositionRef.current !== 1
            ? NavigationService.replace(NAVIGATION.LOGIN)
            : null
        }
      />

      <PagerView
        ref={pagerViewRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={e => setSliderPosition(e.nativeEvent.position)}>
        <View key="1" style={styles.sliderPageContainer}>
          {/* <SvgIcon
            icon={images.img_walk_through_1}
            width={screenWidth}
            height={screenHeight * 0.45}
          /> */}
          <FastImage
            style={{
              width: screenWidth,
              //height: screenHeight * 0.45,
              alignSelf: 'center',
              flex: 1,
            }}
            source={images.walk_through_1}
            resizeMode={FastImage.resizeMode.cover}
          />

          <Text style={styles.titleText}>
            {strings.onboarding.walkthrough1Title}
          </Text>
          <Text style={styles.messageText}>
            {strings.onboarding.walkthrough1Message}
          </Text>
        </View>

        <View key="2" style={styles.sliderPageContainer}>
          {/* <SvgIcon
            icon={images.img_walk_through_2}
            width={screenWidth}
            height={screenHeight * 0.45}
          /> */}
          <FastImage
            style={{
              width: screenWidth,
              // height: screenHeight * 0.45,
              alignSelf: 'center',
              flex: 1,
            }}
            source={images.walk_through_2}
            resizeMode={FastImage.resizeMode.cover}
          />
          <Text style={styles.titleText}>
            {strings.onboarding.walkthrough2Title}
          </Text>
          <Text style={styles.messageText}>
            {strings.onboarding.walkthrough2Message}
          </Text>
        </View>

        {/* <View key="3" style={styles.sliderPageContainer}>
          <SvgIcon
            icon={images.img_walk_through_3}
            width={screenWidth}
            height={screenHeight * 0.45}
          />
          <Text style={styles.titleText}>
            {strings.onboarding.walkthrough3Title}
          </Text>
          <Text style={styles.messageText}>
            {strings.onboarding.walkthrough3Message}
          </Text>
        </View> */}
      </PagerView>

      <Spacer size={12} />

      <Dots
        length={2}
        alignDotsOnXAxis
        active={sliderPositionRef.current}
        activeColor={sliderActiveDotBgColor}
        passiveColor={sliderPassiveDotBgColor}
        activeDotWidth={26}
        activeDotHeight={8}
        passiveDotWidth={8}
        passiveDotHeight={8}
        marginHorizontal={5}
      />

      <Spacer size={12} />

      <View style={styles.footerTextButtonContainer}>
        {sliderPositionRef.current !== 0 && (
          <TextButton
            label={strings.common.previous}
            textStyle={styles.textButtonStyle}
            style={styles.textButtonContainer}
            onPress={() => {
              pagerViewRef.current?.setPage(sliderPositionRef.current - 1);
              setSliderPosition(sliderPositionRef.current - 1);
            }}
          />
        )}

        <View style={styles.flexOne} />

        {sliderPositionRef.current !== 1 && (
          <TextButton
            label={strings.common.next}
            textStyle={styles.textButtonStyle}
            style={styles.textButtonContainer}
            onPress={() => {
              pagerViewRef.current?.setPage(sliderPositionRef.current + 1);
              setSliderPosition(sliderPositionRef.current + 1);
            }}
          />
        )}
      </View>

      <Spacer size={isAndroid ? 12 : 45} />

      {sliderPositionRef.current === 1 ? (
        <Button
          text={strings.onboarding.getStarted}
          onPress={() => NavigationService.navigate(NAVIGATION.LOGIN)}
        />
      ) : (
        <Spacer size={53} />
      )}
    </Screen>
  );
};

export default Onboarding;
