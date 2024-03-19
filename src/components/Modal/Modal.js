import React, {useRef, forwardRef, useImperativeHandle} from 'react';
import PropTypes from 'prop-types';
import {Text, View, StyleSheet, SafeAreaView} from 'react-native';
import {Modalize} from 'react-native-modalize';
import {textColorBlack, textColorGrayDarker} from '@/theme/colors';

export const Modal = forwardRef((props, ref) => {
  const modalRef = useRef();

  useImperativeHandle(ref, () => ({
    openModal() {
      if (modalRef.current) {
        modalRef.current.open();
      }
    },
    closeModal() {
      if (modalRef.current) {
        modalRef.current.close();
      }
    },
  }));

  const renderContent = () => {
    const {title, subtitle, modalStyle} = props;
    return (
      <View style={modalStyle}>
        <View>
          {(title && <Text style={styles.titleStyle}>{title}</Text>) || null}

          {(subtitle && (
            <Text numberOfLines={3} style={styles.subtitleStyle}>
              {subtitle}
            </Text>
          )) ||
            null}
        </View>
        <View>{props.children}</View>
      </View>
    );
  };

  return (
    <Modalize
      ref={modalRef}
      handlePosition="inside"
      panGestureEnabled
      withHandle={false}
      FooterComponent={<SafeAreaView />}
      {...props}>
      {props.children && renderContent()}
    </Modalize>
  );
});

Modal.defaultProps = {
  title: null,
  subtitle: null,
};

Modal.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
};

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 24,
    paddingTop: 16,
    marginTop: 8,
    marginLeft: 6,
  },
  titleStyle: {
    fontSize: 23,
    marginTop: 8,
    color: textColorBlack,
    fontWeight: '600',
  },
  subtitleStyle: {
    fontSize: 15,
    fontSize: 14,
    color: textColorGrayDarker,
    lineHeight: 22,
    paddingTop: 4,
    paddingBottom: 10,
    fontWeight: '200',
  },
});
