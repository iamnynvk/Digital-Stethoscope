import React, {useRef, forwardRef, useImperativeHandle, useMemo} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet, Keyboard} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SvgIcon, Touchable, Modal} from '@/components';
import {
  modalHighlightColor,
  separatorColor,
  textColorBlack,
  textColorGrayDarker,
} from '@/theme/colors';
import useStateRef from '@/hooks/useStateRef';
import {FONT_MEDIUM, FONT_REGULAR} from '@/theme/typography';
import {TextInput} from 'react-native-gesture-handler';
import {getStatusBarHeight} from 'react-native-iphone-x-helper';
import images from '@/assets/images';
import {strings} from '@/localization';

export const CountryPickerModal = forwardRef((props, ref) => {
  //refs
  const modalRef = useRef();

  //states
  const [searchText, setSearchText, searchTextRef] = useStateRef('');
  const [selectedCountryCode, setSelectedCallingCode, selectedCallingCodeRef] =
    useStateRef(props.defaultCountry);

  useImperativeHandle(ref, () => ({
    openModal(selectedCountry) {
      if (modalRef.current) {
        if (selectedCountry) {
          setSelectedCallingCode(selectedCountry);
        }

        Keyboard.dismiss();
        modalRef.current.openModal();
      }
    },
    closeModal() {
      if (modalRef.current) {
        modalRef.current.closeModal();
      }
    },
  }));

  const renderItem = ({item, index}) => (
    <Touchable
      onPress={() => {
        props.onSelect && props.onSelect(item);
        console.log(item);
        setSelectedCallingCode(item.countryCallingCode);
        closeModal();
      }}>
      <View
        style={
          selectedCallingCodeRef.current == item.countryCallingCode
            ? styles.listItemHighlightedContainer
            : styles.listItemContainer
        }>
        {props.withFlag && <Text style={styles.flagStyle}>{item?.flag}</Text>}

        <Text
          style={
            selectedCallingCodeRef.current == item.countryCallingCode
              ? styles.highlightedTitleStyle
              : styles.titleStyle
          }>
          {item?.countryNameEn}{' '}
          {props.withCallingCode && <Text>(+{item?.countryCallingCode})</Text>}
        </Text>
      </View>
    </Touchable>
  );

  const {bottom: bottomSafeArea} = useSafeAreaInsets();

  const contentContainerStyle = useMemo(
    () => ({
      ...styles.contentContainer,
      paddingBottom: bottomSafeArea,
      flexGrow: 1,
    }),
    [bottomSafeArea],
  );

  const listItemSeparator = () => <View style={styles.separatorStyle} />;

  const renderSearchInput = () => (
    <>
      <View style={styles.searchInputContainer}>
        <TextInput
          style={styles.inputTextStyle}
          placeholder={strings.common.countryPickerSearchHint}
          value={searchTextRef.current}
          onChangeText={text => setSearchText(text)}
        />

        <Touchable
          style={styles.closeIconContainer}
          onPress={() => closeModal()}>
          <SvgIcon icon={images.ic_cancel} width={16} height={16} />
        </Touchable>
      </View>
      <View style={styles.modalHeaderLine}></View>
    </>
  );

  const filteredData = searchTextRef.current
    ? props.countryData.filter(item =>
        item.countryNameEn
          .toLowerCase()
          .includes(searchTextRef.current.toLowerCase()),
      )
    : props.countryData;

  const listEmptyComponent = () => {
    return (
      <View style={styles.emptyComponentContainer}>
        <Text style={styles.emptyComponentText}>
          {strings.common.emptyData}
        </Text>
      </View>
    );
  };

  const closeModal = () => {
    Keyboard.dismiss();
    modalRef?.current?.closeModal();
  };

  return (
    <Modal
      ref={modalRef}
      closeOnOverlayTap
      HeaderComponent={renderSearchInput}
      withHandle={false}
      flatListProps={{
        data: filteredData,
        renderItem: renderItem,
        keyExtractor: (item, index) => index.toString(),
        showsVerticalScrollIndicator: false,
        ItemSeparatorComponent: listItemSeparator,
        contentContainerStyle: contentContainerStyle,
        ListEmptyComponent: listEmptyComponent,
        keyboardShouldPersistTaps: 'handled',
      }}
    />
  );
});

CountryPickerModal.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  withFilter: PropTypes.bool,
  withCallingCode: PropTypes.bool,
  withFlag: PropTypes.bool,
  countryData: PropTypes.array,
};

CountryPickerModal.defaultProps = {
  title: null,
  subtitle: null,
  withFilter: true,
  withCallingCode: true,
  withFlag: true,
  countryData: null,
};

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    overflow: 'visible',
    paddingVertical: 16,
  },
  separatorStyle: {
    height: 0.5,
    backgroundColor: separatorColor,
  },
  searchInputContainer: {
    flexDirection: 'row',
    marginTop: getStatusBarHeight() + 16,
  },
  inputTextStyle: {
    ...FONT_REGULAR,
    ...{
      flex: 1,
      height: 40,
      marginStart: 30,
      marginEnd: 16,
      borderBottomWidth: 0.5,
      fontSize: 15,
    },
  },
  closeIconContainer: {
    justifyContent: 'center',
    marginEnd: 16,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 9,
    borderColor: separatorColor,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginVertical: 4,
  },
  listItemHighlightedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: modalHighlightColor,
    borderRadius: 5,
    paddingVertical: 12,
    marginVertical: 4,
  },
  titleStyle: {
    ...FONT_REGULAR,
    ...{
      fontSize: 16,
      color: textColorGrayDarker,
      marginHorizontal: 10,
    },
  },
  highlightedTitleStyle: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 16,
      color: textColorBlack,
      marginHorizontal: 10,
    },
  },
  flagStyle: {
    fontSize: 16,
    marginStart: 4,
  },
  emptyComponentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  emptyComponentText: {
    ...FONT_REGULAR,
    ...{
      color: textColorGrayDarker,
    },
  },
});
