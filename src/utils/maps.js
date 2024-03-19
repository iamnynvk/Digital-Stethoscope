import {isTablet} from 'react-native-device-detection';
import images from '@/assets/images';

/**
 * An object describing touchable areas in the image.
 */
export const FRONT_HEART_MAP = [
  {
    id: '0',
    x1: isTablet ? -58 : -48,
    y1: isTablet ? 0 : 9,
    image: images.ic_front_heart_base_right,
    name: 'Base Right (Aortic area)',
    fill: 'blue',
    width: isTablet ? 170 : 170,
    height: isTablet ? 170 : 170,
  },
  {
    id: '1',
    x1: isTablet ? 110 : 158,
    y1: isTablet ? -30 : -5,
    image: images.ic_front_heart_base_left,
    name: 'Base Left (Pulmonic area)',
    width: isTablet ? 170 : 180,
    height: isTablet ? 170 : 180,
  },
  {
    id: '2',
    x1: isTablet ? 130 : 182,
    y1: isTablet ? 166 : 166,
    image: images.ic_front_heart_apex,
    name: 'Apex (Mitral area)',
    fill: 'blue',
    width: isTablet ? 130 : 130,
    height: isTablet ? 130 : 150,
  },
];

export const BACK_HEART_MAP = [
  {
    id: '0',
    x1: isTablet ? -12 : -40,
    y1: isTablet ? 5 : 16,
    image: images.ic_left_upper_zone,
    name: 'Left Upper Zone',
    width: isTablet ? 110 : 160,
    height: isTablet ? 110 : 160,
  },
  {
    id: '1',
    x1: isTablet ? 110 : 160,
    y1: isTablet ? 5 : 12,
    image: images.ic_right_upper_zone,
    name: 'Right Upper Zone',
    width: isTablet ? 130 : 170,
    height: isTablet ? 110 : 160,
  },
  {
    id: '2',
    x1: isTablet ? -12 : -16,
    y1: isTablet ? 175 : 180,
    image: images.ic_left_lower_zone,
    name: 'Left Lower Zone',
    width: isTablet ? 110 : 120,
    height: isTablet ? 110 : 120,
  },
  {
    id: '3',
    x1: isTablet ? 130 : 180,
    y1: isTablet ? 175 : 180,
    image: images.ic_right_lower_zone,
    name: 'Right Lower Zone',
    width: isTablet ? 90 : 124,
    height: isTablet ? 90 : 124,
  },
  {
    id: '4',
    x1: isTablet ? -24 : -30,
    y1: isTablet ? 140 : 150,
    image: images.ic_left_axilla,
    name: 'Left Axilla',
    width: isTablet ? 90 : 110,
    height: isTablet ? 90 : 110,
  },
  {
    id: '5',
    x1: isTablet ? 150 : 200,
    y1: isTablet ? 140 : 150,
    image: images.ic_right_axilla,
    name: 'Right Axilla',
    width: isTablet ? 90 : 110,
    height: isTablet ? 90 : 110,
  },
];
