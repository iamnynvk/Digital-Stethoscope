import React, {useEffect, useRef} from 'react';
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
  UserInfoView,
} from '@/components';
import images from '@/assets/images';
import {styles} from './Home.styles';
import {ExpandableView} from './components/ExpandableView';
import useAuth from '@/hooks/useAuth';
import useStateRef from '@/hooks/useStateRef';
import NavigationService from '@/navigation/NavigationService';
import {NAVIGATION} from '@/constants';
import {isAndroid} from '@/utils/platform';
import {fetchVitalsList, removeVitalsFile} from '@/utils/firebase';
import {deleteFromTree, getFullName} from '@/utils/misc';
import {CustomDatePicker} from '@/components/DatePicker';
import {formateDate, getLastOneMonthDate} from '@/utils/date';
import useHandleScroll from '@/hooks/useHandleScroll';
import {share} from '@/utils/share';
import {strings} from '@/localization';
import {showToast} from '@/utils/info';

const ViewAllFile = props => {
  const selectedUser = props.route.params?.user;
  const memberList = props.route.params?.memberList;
  const startDate = props.route.params?.fromDate;

  const {authUser} = useAuth();

  const cellRefs = useRef({});
  const datePickerRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const mockData = [
    {
      title: '',
      data: [1, 2, 3, 4, 5],
    },
  ];
  const {handleScroll, showButton} = useHandleScroll();

  //state
  const [user, setUser, userRef] = useStateRef(selectedUser);
  const [listDataSource, setListDataSource, listDataSourceRef] = useStateRef(
    [],
  );

  const [refresh, setRefresh, refreshRef] = useStateRef(false);
  const [selectedItem, setSelectedItem, selectedItemRef] = useStateRef(null);
  const [
    currentPlayingFileId,
    setCurrentPlayingFileId,
    currentPlayingFileIdRef,
  ] = useStateRef(null);
  const [isFetching, setFetching, isFetchingRef] = useStateRef(true);
  const [error, setError, errorRef] = useStateRef(null);
  const [dateType, setDateType, dateTypeRef] = useStateRef('From');
  const [fromDate, setFromDate, fromDateRef] = useStateRef(
    getLastOneMonthDate(startDate),
  );
  const [toDate, setToDate, toDateRef] = useStateRef(new Date());
  const [maxDate, setMaxDate, maxDateRef] = useStateRef(new Date());
  const [minDate, setMinDate, minDateRef] = useStateRef(new Date(1950, 0, 1));
  const [reload, setReload, reloadRef] = useStateRef(false);

  if (isAndroid) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  useEffect(() => {
    getVitalsList();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('beforeRemove', () => {
      if (props.route.params && props.route.params.onGoBack) {
        props.route.params.onGoBack(reloadRef.current);
      }
    });

    return () => unsubscribe();
  }, [props.navigation]);

  const getVitalsList = async () => {
    setFetching(true);

    try {
      const result = await fetchVitalsList(
        userRef.current.userId,
        null,
        'addedBy',
        '==',
        fromDateRef.current,
        toDateRef.current,
      );
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
        <Touchable
          style={styles.backArrow}
          onPress={() => NavigationService.goBack()}>
          <SvgIcon icon={images.ic_back_arrow_white} />
        </Touchable>

        <View style={styles.flexOne} />
        <Text style={styles.headerText}>Heart Rates</Text>
        <View style={styles.flexOne} />

        <Spacer size={26} horizontal />
        {/* <SvgIcon icon={images.ic_more_vertical} /> */}
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

  const isFileAvailable = item =>
    item &&
    item.deviceValue &&
    item.deviceValue.length &&
    item.deviceValue[0].file;

  const handleDeleteFile = async item => {
    try {
      await removeVitalsFile(
        item.vitalId,
        userRef.current.userId,
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
    if (authUser.userId === userRef.current.userId) {
      NavigationService.navigate(NAVIGATION.UPDATE_PROFILE, {
        isFrom: NAVIGATION.APP_NAVIGATOR,
        user: userRef.current,
        memberList,
        onGoBack: reload => {
          if (reload) {
            setUser(authUser);
            setReload(true);
          }
        },
      });
    } else {
      NavigationService.navigate(NAVIGATION.PROFILE, {
        user: userRef.current,
        memberList,
        onGoBack: reload => (reload ? setReload(true) : null),
      });
    }
  };

  const handleAddVitalPress = () => {
    NavigationService.navigate(NAVIGATION.RECORD_VITALS, {
      user: userRef.current,
      onGoBack: reload => {
        if (reload) {
          setFromDate(new Date());
          getVitalsList();
          setReload(true);
        }
      },
    });
  };

  return (
    <Screen style={styles.container}>
      {Header()}

      <View style={styles.fileListSection}>
        <UserInfoView
          name={getFullName(
            userRef.current?.firstName,
            userRef.current?.lastName,
          )}
          email={userRef.current?.email}
          profileImg={userRef.current?.profileImg}
          onItemPress={() => handleUserInfoPress()}
        />

        <Spacer size={10} />

        <View style={styles.dateContainer}>
          <View style={styles.flexOne}>
            <Text style={styles.dateLabel}>{strings.home.from}</Text>
            <Touchable
              style={styles.dateBoxContainer}
              onPress={() => {
                console.log(toDateRef.current);
                setDateType('From');
                setMaxDate(new Date(toDateRef.current));
                setMinDate(new Date(1950, 0, 1));
                datePickerRef.current?.openDatePicker();
              }}>
              <Text style={styles.dateText}>
                {formateDate(fromDateRef.current, 'DD-MM-YYYY')}
              </Text>
            </Touchable>
          </View>
          <Spacer size={16} horizontal />
          <View style={styles.flexOne}>
            <Text style={styles.dateLabel}>{strings.home.to}</Text>
            <Touchable
              style={styles.dateBoxContainer}
              onPress={() => {
                setDateType('To');
                setMaxDate(new Date());
                setMinDate(new Date(fromDateRef.current));
                datePickerRef.current?.openDatePicker();
              }}>
              <Text style={styles.dateText}>
                {formateDate(toDateRef.current, 'DD-MM-YYYY')}
              </Text>
            </Touchable>
          </View>
        </View>

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
            getVitalsList();
          }}
        />

        {showButton && (
          <View style={styles.footerBtnContainer}>
            <FloatingActionButton
              size={66}
              Icon={SvgIcon}
              onPress={() => handleAddVitalPress()}
            />
          </View>
        )}
      </View>

      <CustomDatePicker
        ref={datePickerRef}
        date={
          dateTypeRef.current === 'From'
            ? new Date(fromDateRef.current)
            : new Date(toDateRef.current)
        }
        minDate={minDateRef.current}
        maxDate={maxDateRef.current}
        onDateChange={selectedDate => {
          if (dateTypeRef.current === 'From') {
            setFromDate(selectedDate);
          } else {
            setToDate(selectedDate);
          }
          getVitalsList();
        }}
      />
    </Screen>
  );
};
export default ViewAllFile;
