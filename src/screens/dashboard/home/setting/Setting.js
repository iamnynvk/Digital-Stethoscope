import React, {useState, useEffect, useContext} from 'react';
import {BackButton, Scaffold, Screen} from '@/components';
import {styles} from '@/screens/dashboard/home/setting/Setting.styles';
import {NAVIGATION, PREFERENCES} from '@/constants';
import {strings} from '@/localization';
import {View, Text, Dimensions} from 'react-native';
import {storage} from '@/utils/storage';

import Animated from 'react-native-reanimated';
import BottomSheet from 'reanimated-bottom-sheet';

import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import {useBackHandler} from '@/hooks/useBackHandler';
import NavigationService from '@/navigation/NavigationService';
import {AuthContext} from '@/navigation/AuthProvider';

const Setting = props => {
  // State
  const [getGain, setGetGain] = useState(200);

  // getting Props
  const isFrom = props.route.params?.isFrom;

  // List of Gain Voice
  const voiceGain = [
    25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400,
    425, 450, 475, 500, 525, 550, 575, 600, 625, 650, 675, 700,
  ];

  // reference
  const bs = React.useRef();
  const fall = new Animated.Value(1);
  const context = useContext(AuthContext);

  console.log('this is Context :', context.getGain);

  useEffect(() => {
    context.setGetGain(getGain);
    getData();
  }, [getGain]);

  // Back Button Clicked to Close BottomSheet
  useBackHandler(() => {
    if (bs.current.snapTo != 0) {
      bs.current.snapTo(1);
      NavigationService.goBack();
      return true;
    }
    return false;
  });

  const renderInner = () => {
    return (
      <View style={styles.mainView}>
        <View style={styles.childView}>
          <Text style={[styles.headerTitle, {marginStart: 10}]}>
            Choose Gain
          </Text>
          <TouchableOpacity onPress={() => bs.current.snapTo(1)}>
            <Text style={[styles.headerTitle, {marginEnd: 10}]}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={voiceGain}
          scrollEnabled={true}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          decelerationRate={'fast'}
          keyExtractor={item => item}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={styles.listStyles}
                onPress={() => {
                  dataStore(item);
                }}>
                <View>
                  <Text style={styles.itemRender}>{item}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    );
  };

  const dataStore = async item => {
    try {
      if (item === null) {
        setGetGain(getGain);
      } else {
        setGetGain(item);
        storage.set(PREFERENCES.GAIN, item);
        console.log('set preferences : ', getGain);
      }
      bs.current.snapTo(1);
    } catch (err) {
      console.log('setting gain error :', err);
    }
  };

  const getData = async () => {
    try {
      const value = await storage.get(PREFERENCES.GAIN);
      value.data && setGetGain(value.data);
      console.log('get value : ', getGain);
    } catch (err) {
      console.log('getting gain error:', err);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerOpen}>
      <View style={styles.pannelHeader}>
        <View style={styles.pannelHandle}></View>
      </View>
    </View>
  );

  return (
    <Screen>
      <Scaffold>
        <Animated.View
          style={[
            styles.container,
            {opacity: Animated.add(0.3, Animated.multiply(fall, 1.0))},
          ]}>
          {/* header  */}
          {isFrom === NAVIGATION.APP_NAVIGATOR ? (
            <BackButton
              title={strings.updateProfile.setting}
              style={styles.backButton}
            />
          ) : (
            <Text style={styles.headerText}>
              {strings.updateProfile.setting}
            </Text>
          )}

          {/* body text */}
          <View
            style={[styles.header]}
            onTouchStart={() => bs.current.snapTo(0)}>
            <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
              <View style={styles.textMainView}>
                <Text style={[styles.textDecor]}>Gain</Text>

                <Text style={[styles.textDecorGain]}>{getGain}</Text>
              </View>
              <View style={styles.childText}>
                <Text style={[styles.textDesign]}>
                  Audio Enhancement without Quality Degradation
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Scaffold>
      <BottomSheet
        ref={bs}
        snapPoints={['60%', 0, 0]}
        renderHeader={renderHeader}
        renderContent={renderInner}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
      />
    </Screen>
  );
};

export default Setting;
