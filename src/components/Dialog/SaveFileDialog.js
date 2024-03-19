import React from 'react';
import {Button} from '@/components';
import {DialogModal} from '@/components/Dialog/DialogModal';
import {StyleSheet, Text, View} from 'react-native';
import {strings} from '@/localization';
import {borderColor, textColorPrimary, whiteColor} from '@/theme/colors';
import {FONT_MEDIUM} from '@/theme/typography';

export const SaveFileDialog = props => {
  const {isVisible, closeModal, onPositiveButtonPress, onNegativeButtonPress} =
    props;

  return (
    <DialogModal
      isVisible={isVisible}
      onBackdropPress={() => closeModal()}
      onBackButtonPress={() => closeModal()}>
      <DialogModal.Container>
        <DialogModal.Body>
          <Text style={styles.modalText}>
            {strings.common.saveRecordingMessage}
          </Text>
        </DialogModal.Body>
        <DialogModal.Footer>
          <View style={styles.modalButtonWrapper}>
            <Button
              text="No"
              style={styles.modalNegativeButton}
              textStyle={styles.modalButtonText}
              onPress={() => onNegativeButtonPress()}
            />
            <Button
              text="Yes"
              style={styles.modalPositiveButton}
              onPress={() => onPositiveButtonPress()}
            />
          </View>
        </DialogModal.Footer>
      </DialogModal.Container>
    </DialogModal>
  );
};

const styles = StyleSheet.create({
  modalText: {
    ...FONT_MEDIUM,
    ...{
      fontSize: 20,
      marginHorizontal: 20,
    },
  },
  modalButtonWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  modalPositiveButton: {
    flex: 1,
    borderRadius: 25,
    marginEnd: 20,
  },
  modalNegativeButton: {
    flex: 1,
    backgroundColor: whiteColor,
    borderColor: borderColor,
    borderWidth: 2,
    borderRadius: 25,
    marginStart: 20,
    marginEnd: 12,
  },
  modalButtonText: {
    color: textColorPrimary,
  },
});
