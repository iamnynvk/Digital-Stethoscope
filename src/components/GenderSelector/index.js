import React from 'react';
import {Text, View} from 'react-native';
import styles from './styles';
import {Button} from '@/components';
import {strings} from '@/localization';

/**
 * A gender selector component using Button internally.
 */

export const GenderSelector = props => {
  const {selectedGender, onSelect} = props;
  return (
    <>
      <Text style={styles.inputLabel}>{strings.common.gender}</Text>

      <View style={styles.genderButtonContainer}>
        <Button
          text={strings.common.male}
          onPress={() => onSelect && onSelect('male')}
          style={
            selectedGender == 'male'
              ? styles.genderButtonHighlighted
              : styles.genderButton
          }
          textStyle={
            selectedGender == 'male'
              ? styles.genderButtonHighlightedText
              : styles.genderButtonText
          }
        />
        <Button
          text={strings.common.female}
          onPress={() => onSelect && onSelect('female')}
          style={
            selectedGender == 'female'
              ? styles.genderButtonHighlighted
              : styles.genderButton
          }
          textStyle={
            selectedGender == 'female'
              ? styles.genderButtonHighlightedText
              : styles.genderButtonText
          }
        />

        <Button
          text={strings.common.other}
          onPress={() => onSelect && onSelect('other')}
          style={
            selectedGender == 'other'
              ? styles.genderButtonHighlighted
              : styles.genderButton
          }
          textStyle={
            selectedGender == 'other'
              ? styles.genderButtonHighlightedText
              : styles.genderButtonText
          }
        />
      </View>
    </>
  );
};

export default GenderSelector;
