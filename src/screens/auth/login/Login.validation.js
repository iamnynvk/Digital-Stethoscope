import {showToast} from '@/utils/info';
import {validate} from '@/utils/validation';

export const validateForm = phoneNo => {
  const phoneNoError = validate('phone', phoneNo);

  if (phoneNoError) {
    showToast(phoneNoError);
    return false;
  }

  return true;
};
