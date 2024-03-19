import {strings} from '@/localization';

const validatejs = require('validate.js');

export const validationDictionary = {
  bool: {
    presence: {
      allowEmpty: false,
      message: '^This is required',
    },
  },
  day: {
    presence: {
      allowEmpty: false,
      message: '^This is required',
    },
    numericality: {
      greaterThan: 0,
      lessThanOrEqualTo: 31,
      message: '^Must be valid',
    },
  },
  email: {
    presence: {
      allowEmpty: false,
      message: `^${strings.errorMessages.missingEmail}`,
    },
    email: {
      message: `^${strings.errorMessages.invalidEmail}`,
    },
  },
  generic: {
    presence: {
      allowEmpty: false,
      message: '^This is required',
    },
  },
  integer: {
    presence: {
      allowEmpty: false,
      message: '^This is required',
    },
    numericality: {
      greaterThan: 0,
      onlyInteger: true,
      message: '^Must be valid',
    },
  },
  month: {
    presence: {
      allowEmpty: false,
      message: '^This is required',
    },
    numericality: {
      greaterThan: 0,
      lessThanOrEqualTo: 12,
      message: '^Must be valid',
    },
  },
  password: {
    presence: {
      allowEmpty: false,
      message: `^${strings.errorMessages.missingPassword}`,
    },
    // length: {
    //   minimum: 6,
    //   message: `^${strings.errorMessages.invalidPasswordLength}`,
    // },
  },
  phone: {
    presence: {
      allowEmpty: false,
      message: `^${strings.errorMessages.missingPhone}`,
    },
    // format: {
    //   pattern: /^[2-9]\d{2}-\d{3}-\d{4}$/,
    //   message: `^${strings.errorMessages.invalidPhone}`,
    // },
  },
  state: {
    presence: {
      allowEmpty: false,
      message: '^This is required',
    },
    inclusion: {
      within: [
        'AK',
        'AL',
        'AR',
        'AZ',
        'CA',
        'CO',
        'CT',
        'DC',
        'DE',
        'FL',
        'GA',
        'HI',
        'IA',
        'ID',
        'IL',
        'IN',
        'KS',
        'KY',
        'LA',
        'MA',
        'MD',
        'ME',
        'MI',
        'MN',
        'MO',
        'MS',
        'MT',
        'NC',
        'ND',
        'NE',
        'NH',
        'NJ',
        'NM',
        'NV',
        'NY',
        'OH',
        'OK',
        'OR',
        'PA',
        'RI',
        'SC',
        'SD',
        'TN',
        'TX',
        'UT',
        'VA',
        'VT',
        'WA',
        'WI',
        'WV',
        'WY',
      ],
      message: '^Must be valid',
    },
  },
  zip: {
    presence: {
      allowEmpty: false,
      message: '^This is required',
    },
    length: {
      is: 5,
      message: '^Zip must be 5 digits long',
    },
  },
  otp: {
    presence: {
      allowEmpty: false,
      message: '^OTP is required',
    },
    length: {
      minimum: 6,
      message: `^${strings.errorMessages.invalidOTPLength}`,
    },
  },
};

export const validate = (fieldName, value) => {
  var formValues = {};
  formValues[fieldName] = value;
  var formFields = {};
  formFields[fieldName] = validationDictionary[fieldName];
  const result = validatejs(formValues, formFields);
  if (result) {
    return result[fieldName][0];
  }
  return null;
};
