import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles';
import {RawLabel} from '../RawLabel';
import {Touchable} from '../TouchableItem';

/**
 * A button styled like a web link.
 */
export const WebLink = props => {
  const {title, onPress} = props;

  return (
    <Touchable onPress={onPress}>
      <RawLabel style={styles.link} text={title} />
    </Touchable>
  );
};

WebLink.propTypes = {
  title: PropTypes.string.isRequired,
  onPress: PropTypes.func,
};
