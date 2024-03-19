import moment from 'moment';

import {
  momentFormat,
  momentTimestamp,
  momentDateFromTimestamp,
  momentYears,
} from './moment';

/**
 * Format event date strings with momentjs to a human readable string.
 *
 * @param dateStart the start date of format 'YYYY-MM-DD'
 * @param dateEnd the end date of format 'YYYY-MM-DD'
 *
 * @return the formated event date string in format 'DD.MM.YYYY'
 */
export const eventDate = (dateStart, dateEnd) => {
  const dateToFormat = dateStart ?? dateEnd;
  if (!dateToFormat) {
    return '';
  } else {
    return momentFormat(dateToFormat);
  }
};

export const formateDate = (date, returnFormat = 'YYYY-MM-DD') => {
  return momentFormat(date, returnFormat);
};

export const getTimestamp = date => {
  return momentTimestamp(date);
};

export const getDateFromTimestamp = timestamp => {
  return momentDateFromTimestamp(timestamp);
};

export const isBeforeEndOfToday = date => {
  return moment(date, 'YYYY-MM-DD').isBefore(moment().endOf('day'));
};

export const isTodayOrLater = date => {
  return moment().isBefore(moment(date, 'YYYY-MM-DD').endOf('day'));
};

export const getAge = date => momentYears(date);

export const getCurrentDate = (returnFormat = 'YYYY-MM-DD') =>
  moment().format(returnFormat);

export const getLastOneMonthDate = date =>
  moment(date).subtract(30, 'days').toISOString();

export const formattedSeconds = seconds =>
  moment().startOf('day').seconds(seconds).format('mm:ss');

export const convertTimeToUTC = date => moment.utc(moment(date).utc()).format();

export const formateTime = (date, returnFormat) =>
  moment(date).format(returnFormat);
