import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  SectionList,
  LayoutAnimation,
  UIManager,
  AppState,
} from 'react-native';
import {
  EmptyList,
  FallbackComponent,
  FloatingActionButton,
  Screen,
  Shimmer,
  Spacer,
  SvgIcon,
  Touchable,
  UserGalleryList,
  UserInfoView,
} from '@/components';
import images from '@/assets/images';
import {styles} from './Home.styles';
import {ExpandableView} from './components/ExpandableView';
import useStateRef from '@/hooks/useStateRef';
import NavigationService from '@/navigation/NavigationService';
import {NAVIGATION, PREFERENCES} from '@/constants';
import {isAndroid} from '@/utils/platform';
import {
  fetchMembersList,
  fetchVitalsList,
  removeVitalsFile,
  convertTimestampToDate,
} from '@/utils/firebase';
import {deleteFromTree, getFullName} from '@/utils/misc';
import {strings} from '@/localization';
import {showAsyncAlert, showToast} from '@/utils/info';
import useHandleScroll from '@/hooks/useHandleScroll';
import {share} from '@/utils/share';
import {whiteColor} from '@/theme/colors';
import useAuth from '@/hooks/useAuth';
import {moderateScale, moderateVerticalScale} from '@/theme/scaling';

// import {storage} from '@/utils/storage';
// import {AuthContext} from '@/navigation/AuthProvider';

const Home = () => {
  const {authUser, logout} = useAuth();

  // const [getPreference, setGetPreference] = useState(200);

  const cellRefs = useRef({});
  const appState = useRef(AppState.currentState);
  const mockData = [
    {
      title: '',
      data: [1, 2, 3, 4, 5],
    },
  ];
  const {handleScroll, showButton} = useHandleScroll();

  //state
  const [listDataSource, setListDataSource, listDataSourceRef] = useStateRef(
    [],
  );
  const [memberListData, setMemberListData, memberListDataRef] = useStateRef(
    [],
  );
  const [refresh, setRefresh, refreshRef] = useStateRef(false);
  const [selectedItem, setSelectedItem, selectedItemRef] = useStateRef(null);
  const [selectedUser, setSelectedUser, selectedUserRef] =
    useStateRef(authUser);
  const [
    currentPlayingFileId,
    setCurrentPlayingFileId,
    currentPlayingFileIdRef,
  ] = useStateRef(null);
  const [error, setError, errorRef] = useStateRef(null);

  //Loaders
  const [isFetching, setFetching, isFetchingRef] = useStateRef(true);
  const [isLoading, setLoading, isLoadingRef] = useStateRef(true);
  //Logout button loader
  const [logoutLoading, setLogoutLoading, logoutLoadingRef] =
    useStateRef(false);

  if (isAndroid) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    getMembers();
    getVitalsList();
    // fatchingValue();
  }, []);

  // voice gain set here using context
  // const context = useContext(AuthContext);

  // useEffect(() => {
  //   setGetPreference(context.getGain);
  // }, [context.getGain]);
  // -------------------

  // voice gain here using get preference (currently not use)
  // const fatchingValue = async () => {
  //   try {
  //     const value = await storage.get(PREFERENCES.GAIN);
  //     console.log('this is get Value of Preference :', value);
  //     value.data && setGetPreference(value.data);
  //   } catch (err) {
  //     console.log(
  //       'this is fatching error to get preference of Voice gain :',
  //       err,
  //     );
  //   }
  // };
  // console.log(getPreference);
  // --------------------------------------------------------------

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  const getMembers = async () => {
    setLoading(true);
    try {
      const result = await fetchMembersList(authUser.group);
      if (result && result.length) {
        setMemberListData(result);
      }
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  const getVitalsList = async () => {
    setFetching(true);
    try {
      const result = await fetchVitalsList(selectedUserRef.current.userId, 10);
      if (result && result.length) {
        setListDataSource(result);
      } else {
        setListDataSource([]);
      }
    } catch (e) {
      setError(e);
    } finally {
      setFetching(false);
    }
  };

  const handleAppStateChange = nextAppState => {
    if (
      appState.current === 'active' &&
      nextAppState.match(/inactive|background/)
    ) {
      console.log('pauseCurrentPlayingVideo');
      pauseCurrentPlayingFile();
    }
    appState.current = nextAppState;
  };

  const Header = () => {
    return (
      <View style={styles.header}>
        {/* <SvgIcon icon={images.ic_hamburger} /> */}
        <Text style={styles.headerText}>Dashboard</Text>
        <View style={styles.flexOne} />
        {/* <SvgIcon icon={images.ic_filter} /> */}

        {/* setting set  */}
        <Touchable onPress={() => handleSetting()}>
          <SvgIcon
            icon={images.ic_settings}
            color={whiteColor}
            width={moderateScale(24, 0.2)}
            height={moderateScale(24, 0.2)}
          />
        </Touchable>
        <Spacer size={26} horizontal />
        {/* <SvgIcon icon={images.ic_more_vertical} /> */}
        <Touchable onPress={() => handleLogout()}>
          <SvgIcon
            icon={images.ic_logout}
            color={whiteColor}
            width={moderateScale(24, 0.2)}
            height={moderateScale(24, 0.2)}
          />
        </Touchable>
      </View>
    );
  };

  const renderItem = ({item, section}) => (
    <ExpandableView
      key={item.vitalId}
      ref={ref => (cellRefs.current[item?.vitalId] = ref)}
      item={item}
      isLoading={isFetchingRef.current}
      togglePlay={async () => updateLayout(item, section)}
      onItemPress={async () => handleListItemPress(item)}
      selectedItem={selectedItemRef.current}
      onShareButtonPress={() => share(item.deviceValue[0].file)}
      onDeletePress={() => handleDeleteFile(item)}
    />
  );

  const isFileAvailable = item =>
    item &&
    item.deviceValue &&
    item.deviceValue.length &&
    item.deviceValue[0].file;

  const handleLogout = async () => {
    if (!logoutLoadingRef.current) {
      const choice = await showAsyncAlert(
        strings.profile.logout,
        strings.profile.logoutMessage,
        [
          {text: strings.common.cancel, onPress: () => Promise.resolve('no')},
          {text: strings.common.yes, onPress: () => 'yes'},
        ],
        {
          cancelable: true,
          onDismiss: () => 'no',
        },
      );

      if (choice === 'yes') {
        setLogoutLoading(true);
        await logout();
        setLogoutLoading(false);
      }
    }
  };

  const handleSetting = async () => {
    if (authUser.userId === selectedUserRef.current.userId) {
      NavigationService.navigate(NAVIGATION.SETTING, {
        isFrom: NAVIGATION.APP_NAVIGATOR,
        user: selectedUserRef.current,
        memberList: memberListDataRef.current,
        onGoBack: reload => {
          if (reload) {
            getMembers();
          }
        },
      });
    }
  };

  const pauseCurrentPlayingFile = async id => {
    const cell = cellRefs.current[currentPlayingFileIdRef.current];
    if (cell) {
      cell.updateItem();
    }
  };

  const updateLayout = async (item, section) => {
    if (item.vitalId != currentPlayingFileIdRef.current) {
      await pauseCurrentPlayingFile(item.vitalId);
    }

    if (isFileAvailable(item)) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      const array = [...listDataSourceRef.current];

      for (let x = 0; x < array.length; x++) {
        for (let y = 0; y < array[x].data.length; y++) {
          if (array[x].data[y].vitalId == item.vitalId) {
            setSelectedItem(item);
            array[x].data[y]['isExpanded'] = true;
            setListDataSource(array);
            setRefresh(!refreshRef.current);
            break;
          }
        }
      }
      setCurrentPlayingFileId(item.vitalId);
    }
  };

  const handleListItemPress = async item => {
    if (item.vitalId != currentPlayingFileIdRef.current) {
      await pauseCurrentPlayingFile(item.vitalId);
    }
    if (selectedItemRef.current == item) {
      setSelectedItem(null);
    } else {
      setSelectedItem(item);
    }
  };

  const handleDeleteFile = async item => {
    try {
      await removeVitalsFile(
        item.vitalId,
        selectedUserRef.current.userId,
        item.deviceValue[0].fileName,
        item.deviceValue[0].fileType,
      );
      const result = deleteFromTree(
        [...listDataSourceRef.current],
        item.vitalId,
      );
      setListDataSource(result);
      setRefresh(!refreshRef.current);
    } catch (error) {
      showToast(error.message);
    }
  };

  const handleUserInfoPress = () => {
    pauseCurrentPlayingFile();
    if (authUser.userId === selectedUserRef.current.userId) {
      NavigationService.navigate(NAVIGATION.UPDATE_PROFILE, {
        isFrom: NAVIGATION.APP_NAVIGATOR,
        user: selectedUserRef.current,
        memberList: memberListDataRef.current,
        onGoBack: reload => {
          if (reload) {
            //setSelectedUser(authUser);
            getMembers();
          }
        },
      });
    } else {
      NavigationService.navigate(NAVIGATION.PROFILE, {
        user: selectedUserRef.current,
        memberList: memberListDataRef.current,
        onGoBack: reload => (reload ? getMembers() : null),
      });
    }
  };

  const handleViewAllPress = () => {
    let {0: firstItem, [listDataSourceRef.current.length - 1]: lastItem} =
      listDataSourceRef.current;

    NavigationService.navigate(NAVIGATION.VIEW_ALL_FILE, {
      user: selectedUserRef.current,
      members: memberListDataRef.current,
      fromDate: convertTimestampToDate(lastItem.data[0].recordedDate),
      onGoBack: reload => {
        if (reload) {
          getMembers();
          getVitalsList();
        }
      },
    });
  };

  const handleAddVitalPress = () => {
    NavigationService.navigate(NAVIGATION.RECORD_VITALS, {
      user: selectedUserRef.current,
      onGoBack: reload => (reload ? getVitalsList() : null),
    });
  };

  return (
    <Screen style={styles.container}>
      {Header()}

      <Spacer size={moderateVerticalScale(26)} />

      <UserGalleryList
        users={memberListDataRef.current}
        onSelect={user => {
          if (user.userId != selectedUserRef.current.userId) {
            setSelectedUser(user);
            getVitalsList();
          }
        }}
        selectedUser={selectedUserRef.current.userId}
        isLoading={isLoadingRef.current}
      />

      {/* <Text style={{color: whiteColor}}>{getPreference}</Text> */}

      <View style={styles.fileListSection}>
        <UserInfoView
          name={getFullName(
            selectedUserRef.current?.firstName,
            selectedUserRef.current?.lastName,
          )}
          email={selectedUserRef.current?.email}
          profileImg={selectedUserRef.current?.profileImg}
          isLoading={isLoadingRef.current}
          onItemPress={() => handleUserInfoPress()}
        />

        {!isFetchingRef.current && listDataSourceRef.current.length ? (
          <Touchable
            style={styles.viewAllButtonContainer}
            onPress={() => handleViewAllPress()}>
            <Text style={styles.viewAllText}>{strings.home.viewAll}</Text>
          </Touchable>
        ) : null}

        <SectionList
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled
          sections={
            isFetchingRef.current ? mockData : listDataSourceRef.current
          }
          renderItem={renderItem}
          renderSectionHeader={({section}) => {
            if (isFetchingRef.current) return null;

            return (
              <Shimmer
                style={isFetchingRef.current && styles.shimSectionHeader}
                isVisible={!isFetchingRef.current}>
                <Text style={styles.sectionHeader}>{section.title}</Text>
              </Shimmer>
            );
          }}
          keyExtractor={(item, index) =>
            isFetchingRef.current ? item.toString() : String(index)
          }
          extraData={refreshRef.current}
          ListEmptyComponent={!errorRef.current && <EmptyList />}
          onScroll={handleScroll}
        />

        <FallbackComponent
          error={errorRef.current}
          resetError={() => {
            setError(null);
            getMembers();
            getVitalsList();
          }}
        />

        {(showButton || !listDataSourceRef.current.length) && (
          <View style={styles.footerBtnContainer}>
            <FloatingActionButton
              size={66}
              Icon={SvgIcon}
              onPress={() => handleAddVitalPress()}
            />
          </View>
        )}
      </View>
    </Screen>
  );
};
export default Home;
