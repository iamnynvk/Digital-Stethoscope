import React from 'react';
import {Text, View} from 'react-native';
import PropTypes from 'prop-types';
import styles from './styles';
import {Touchable} from '../TouchableItem';
import {SvgIcon} from '../SvgIcon';
import images from '@/assets/images';

/**
 * UI rendered when there's an error.
 *
 * @prop error - The thrown error.
 * @prop buttonText - The button text
 * @prop resetError - A function to reset the error state.
 */

export const FallbackComponent = props => {
  const {error, resetError, buttonText} = props;

  if (!error || error.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      <SvgIcon icon={images.ic_error} width={110} height={110} />
      <Text style={styles.title}>Oops! There's an error</Text>
      <Text style={styles.error}>{error.toString()}</Text>
      <Touchable style={styles.button} onPress={resetError}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Touchable>
    </View>
  );
};

FallbackComponent.propTypes = {
  error: PropTypes.object,
  resetError: PropTypes.func,
  buttonText: PropTypes.string,
};

FallbackComponent.defaultProps = {
  error: 'Issue',
  buttonText: 'Try again',
};
