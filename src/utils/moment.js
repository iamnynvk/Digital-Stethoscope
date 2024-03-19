import moment from 'moment';
import 'moment/locale/de';

/**
 * Format data strings of date and/or time with momentjs to a beautiful human readable string.
 *
 * @param {string | number} dateTime the required data string or timestamp to format
 * @param {string} returnFormat the optional data format of the resulting data string
 * @param {string} dateTimeFormat the optional data format of the passed data string
 *
 * @return {string} the formated date and/or time string
 */
export const momentFormat = (
  dateTime,
  returnFormat = 'YYYY-MM-DD',
  dateTimeFormat = 'YYYY-MM-DD HH:mm:ss Z',
) => moment(dateTime, dateTimeFormat).format(returnFormat);

/**
 * Check if a given date is today or in the future. We will check that with moment `isBefore`.
 *  https://momentjs.com/docs/#/query/is-before/
 *
 * If a date is not before today, it is upcoming.
 *
 * @param {string} date a date
 *
 * @return {bool} true if the date is today or in the future, false if in the past
 */
export const isUpcomingDate = date => {
  if (!date) return false;

  // "using day will check for year, month and day"
  return !moment(date).isBefore(moment(), 'day');
};

const getReadableDay = date => {
  switch (date.getDay()) {
    case 0:
      return 'Sonntag';
    case 1:
      return 'Montag';
    case 2:
      return 'Dienstag';
    case 3:
      return 'Mittwoch';
    case 4:
      return 'Donnerstag';
    case 5:
      return 'Freitag';
    case 6:
      return 'Samstag';
  }
};

/**
 * returns whether a date is after the end date or before the start date
 * @param {Date} date
 * @param {Date | undefined} start
 * @param {Date | undefined} end
 * @return {boolean}
 */
const dateIsWithinTimeFrame = (date, start, end) => {
  // return false if the end is before the date
  if (end) {
    if (!moment(date).isBefore(end)) {
      return false;
    }
  }
  // return false if the start is after the date
  if (start) {
    if (!moment(date).isAfter(start)) {
      return false;
    }
  }

  return true;
};

/**
 * @param {{
 *  open: boolean | null;
 *  weekday: string;
 *  dateFrom: string;
 *  dateTo: string;
 *  timeFrom: string;
 *  timeTo: string
 * }} info
 * @param {Date} date
 * @returns {boolean}
 */
const isOpeningTimeForDate = (info, date) =>
  dateIsWithinTimeFrame(
    date,
    info.dateFrom
      ? moment(new Date(info.dateFrom)).startOf('day').toDate()
      : undefined,
    info.dateTo
      ? moment(new Date(info.dateTo)).endOf('day').toDate()
      : undefined,
  );

/**
 * @param {string} time of the from "hh:mm"
 * @return {Date}
 */
const getTodayWithTime = time => {
  return moment(time, 'HH:mm').toDate();
};

/**
 * Checks for a given array of opening times, if it is currently open, and if it opens or closes soon.
 * The timeDiff contains the remaining minutes until it opens or closes,
 * timeDiff may be undefined, if there are opening times where either timeFrom or timeTo is missing.
 * @param {{
 *  open: boolean | null;
 *  weekday: string;
 *  dateFrom: string;
 *  dateTo: string;
 *  timeFrom: string;
 *  timeTo: string
 * }[]} openingHours
 * @returns {{ timeDiff?: number; open: boolean } | undefined}
 */
export const isOpen = openingHours => {
  // wrap everything into a try/catch in case of one of the strings used as dates do not have an acceptable format
  try {
    // get the current time up to minute precision to work with
    const now = new Date();

    now.setSeconds(0);
    now.setMilliseconds(0);

    // filter out all times that are
    //  - not flagged as open
    //  - not corresponding to the correct weekday
    //  - are not currently valid
    const todaysTimes = openingHours
      .filter(info => !!info.open)
      .filter(info => info.weekday === getReadableDay(now) || !info.weekday)
      .filter(info => isOpeningTimeForDate(info, now));

    // if there are no possible times left, then it is currently closed, and will not open today
    if (!todaysTimes.length) {
      return {open: false};
    }

    // check if it is open right now
    const currentlyValidOpeningTimes = todaysTimes
      .map(info => {
        const timeFrom = info.timeFrom
          ? getTodayWithTime(info.timeFrom)
          : undefined;
        const timeTo = info.timeTo ? getTodayWithTime(info.timeTo) : undefined;

        return {timeFrom, timeTo};
      })
      .filter(({timeFrom, timeTo}) =>
        dateIsWithinTimeFrame(now, timeFrom, timeTo),
      );

    // if it is currently open, check for how long and return the remaining time in minutes
    if (currentlyValidOpeningTimes.length) {
      let timeDiff = 0;

      currentlyValidOpeningTimes.forEach(({timeTo}) => {
        timeDiff = Math.max(timeDiff, moment(timeTo).diff(now, 'minute'));
      });

      return {open: true, timeDiff};
    }

    // check if it will open again today
    const nextOpeningTimes = todaysTimes
      .map(info => ({
        timeFrom: info.timeFrom ? getTodayWithTime(info.timeFrom) : undefined,
      }))
      .filter(({timeFrom}) => !!timeFrom)
      .filter(({timeFrom}) => moment(now).isBefore(timeFrom));

    // if it will open again today, find out the closest time and return the time until opening in minutes
    if (nextOpeningTimes.length) {
      let timeDiff;

      nextOpeningTimes.forEach(({timeFrom}) => {
        const newDiff = moment(timeFrom).diff(now, 'minute');

        timeDiff =
          timeDiff === undefined ? newDiff : Math.min(timeDiff, newDiff);
      });

      return {open: false, timeDiff};
    }

    return {open: false};
  } catch (e) {
    console.warn('Error while determining opening times', e);
  }
};

export const momentTimestamp = date => moment(date).unix();

export const momentDateFromTimestamp = timestamp =>
  moment.unix(timestamp).format();

export const momentYears = date => moment().diff(date, 'years');
