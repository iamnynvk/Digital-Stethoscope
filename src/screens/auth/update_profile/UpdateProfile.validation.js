import {validate} from '@/utils/validation';
import {showToast} from '@/utils/info';
import {strings} from '@/localization';

export const validateForm = (
  firstName,
  lastName,
  email,
  birthdate,
  gender,
  phoneNo,
  profilePic,
) => {
  const firstNameError = validate('generic', firstName);
  const lastNameError = validate('generic', lastName);
  const emailError = validate('email', email);
  const birthdateError = validate('generic', birthdate);
  const genderError = validate('generic', gender);
  const phoneNoError = validate('phone', phoneNo);
  const profilePicError = validate('generic', profilePic);

  if (firstNameError) {
    showToast(strings.errorMessages.missingFirstName);
    return false;
  }
  if (lastNameError) {
    showToast(strings.errorMessages.missingLastName);
    return false;
  }
  if (emailError) {
    showToast(emailError);
    return false;
  }
  if (birthdateError) {
    showToast(strings.errorMessages.missingDateOfBirth);
    return false;
  }
  if (genderError) {
    showToast(strings.errorMessages.missingGender);
    return false;
  }
  if (phoneNoError) {
    showToast(phoneNoError);
    return false;
  }
  // if (profilePicError) {
  //   showToast(strings.errorMessages.missingProfilePic);
  //   return false;
  // }

  return true;
};
