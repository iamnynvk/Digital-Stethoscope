import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Modal from 'react-native-modal';
import PropTypes from 'prop-types';

export const DialogModal = ({isVisible = false, children, ...props}) => {
  return (
    <Modal isVisible={isVisible} swipeDirection="down" {...props}>
      {children}
    </Modal>
  );
};

const ModalContainer = ({children}) => (
  <View style={styles.container}>{children}</View>
);

const ModalHeader = ({title}) => (
  <View style={styles.header}>
    <Text style={styles.text}>{title}</Text>
  </View>
);

const ModalBody = ({children}) => <View style={styles.body}>{children}</View>;

const ModalFooter = ({children}) => (
  <View style={styles.footer}>{children}</View>
);

DialogModal.propTypes = {
  isVisible: PropTypes.bool,
  children: PropTypes.any,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
    borderStyle: 'solid',
    paddingVertical: 16,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    paddingTop: 10,
    textAlign: 'center',
    fontSize: 24,
  },
  body: {
    justifyContent: 'center',
    paddingHorizontal: 15,
    minHeight: 100,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    flexDirection: 'row',
  },
});

DialogModal.Header = ModalHeader;
DialogModal.Container = ModalContainer;
DialogModal.Body = ModalBody;
DialogModal.Footer = ModalFooter;
