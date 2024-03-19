import {showToast} from '@/utils/info';
import {validate} from '@/utils/validation';

export const validateForm = otp => {
  const otpError = validate('otp', otp);
  if (otpError) {
    showToast(otpError);
    return false;
  }
  return true;
};
