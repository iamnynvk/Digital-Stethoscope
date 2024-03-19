const toString = Object.prototype.toString;

export const isObject = arg => {
  return toString.call(arg) === '[object Object]';
};

export const withError = arg => {
  if (isObject(arg)) {
    const {message = '', ...rest} = arg;

    return {
      data: null,
      error: {
        status: true,
        message,
        ...rest,
      },
    };
  }

  return {
    data: null,
    error: {
      status: true,
      message: arg,
    },
  };
};

export const withData = data => ({
  error: false,
  data,
});

export const serialize = data => JSON.stringify(data);

export const parse = data => {
  try {
    const parsedData = JSON.parse(data);

    return withData(parsedData);
  } catch (error) {
    return withError(error);
  }
};

export const isEmpty = value =>
  !value ||
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export const updateObject = (oldObject, updatedProperties) => ({
  ...oldObject,
  ...updatedProperties,
});

// function to format seconds to proper time duration
export const GetDurationFormat = duration => {
  let time = duration / 1000;
  let minutes = Math.floor(time / 60);
  let timeForSeconds = time - minutes * 60;
  let seconds = Math.floor(timeForSeconds);
  let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;
  return `${minutes}:${secondsReadable}`;
};

export const getFullName = (firstName, lastName) =>
  [firstName, lastName].filter(Boolean).join(' ');

export const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

export const deleteFromTree = (array, id) => {
  array.forEach(o =>
    o.data.forEach((subItem, index) => {
      if (subItem.vitalId == id) {
        o.data.splice(index, 1);
      }
    }),
  );
  return array.filter(item => item.data.length);
};

// /**
//  * Returns a string of form "abc...xyz"
//  * @param {string} str string to strink
//  * @param {number} n number of chars to keep at front/end
//  * @returns {string}
//  */
//  export const getEllipsisTxt = (str, n = 6) => {
//   return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`;
// };

// export const tokenValue = (value, decimals) => (decimals ? value / Math.pow(10, decimals) : value);

// /**
//  * Return a formatted string with the symbol at the end
//  * @param {number} value integer value
//  * @param {number} decimals number of decimals
//  * @param {string} symbol token symbol
//  * @returns {string}
//  */
// export const tokenValueTxt = (value, decimals, symbol) => `${n4.format(tokenValue(value, decimals))} ${symbol}`;
