import React, {forwardRef, useImperativeHandle, useState} from 'react';
import PropTypes from 'prop-types';
import {View} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import {isAndroid} from '@/utils/platform';

/**
 * Custom date picker
 *
 * @prop [date] - Specify the display date of DatePicker.(Type - string | date | Moment instance).
 * @prop [color] - The color of the circle.
 * @prop [containerStyle] - Style object applied to the outermost component.
 */

export const CustomDatePicker = forwardRef((props, ref) => {
  const {date, minDate, maxDate, onDateChange} = props;
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  useImperativeHandle(ref, () => ({
    openDatePicker() {
      setDatePickerVisible(true);
    },
  }));

  const renderDatePicker = () => {
    if (isAndroid) {
      return (
        <>
          {datePickerVisible && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date || new Date()}
              display="calendar"
              maximumDate={maxDate}
              minimumDate={minDate}
              onChange={(event, selectedDate) => {
                setDatePickerVisible(false);
                if (selectedDate) {
                  onDateChange(selectedDate);
                }
              }}
            />
          )}
        </>
      );
    }

    return (
      <DatePicker
        modal
        mode="date"
        open={datePickerVisible}
        date={date || new Date()}
        maximumDate={maxDate}
        minimumDate={minDate}
        onConfirm={selectedDate => {
          setDatePickerVisible(false);
          if (selectedDate) {
            onDateChange(selectedDate);
          }
        }}
        onCancel={() => {
          setDatePickerVisible(false);
        }}
      />
    );
  };

  return <View>{renderDatePicker()}</View>;
});

CustomDatePicker.propTypes = {
  date: PropTypes.any,
  onSelectDate: PropTypes.func,
  minDate: PropTypes.date,
  maxDate: PropTypes.date,
};

CustomDatePicker.defaultProps = {
  date: new Date(),
  minDate: new Date(1950, 0, 1),
  maxDate: new Date(),
};
