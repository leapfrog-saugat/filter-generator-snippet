import moment from 'moment';
import React, { useState } from 'react';
import { SingleDatePicker } from 'react-dates';

import * as dateUtils from '../../../../../utils/date';
import { dateFormat } from '../../../../../constants/date';
import { ERASER, GREY_DATE_PICKER_ICON } from '../../../../../constants/images';

const DatePicker = props => {
  /* eslint-disable no-unused-vars*/
  const { label, value, errorMsg, isDisabled, parentWidth, width = '143px', className, placeholder } = props;
  /* enable-eslint no-unused-vars*/
  // Adding moment so that the values are always moment object rather than string.
  const currentValue = value ? moment(value) : null;

  const [focused, setFocused] = useState(false);

  return (
    <React.Fragment>
      <div className={'form-group ' + (errorMsg ? 'has-error' : '')}>
        <div className="label-wrapper">
          <label className="form-group__label form-group__label--block">{label}</label>
          {currentValue && <img alt="Clear" className="clear" src={ERASER} onClick={() => _resetFilter(props)} />}
        </div>
        <div className="block__content">
          <div className={`date-picker ${className || ''}`} style={{ width }}>
            <SingleDatePicker
              isOutsideRange={_isOutsideRange}
              date={currentValue} // momentPropTypes.momentObj or null
              onDateChange={date => handleChange(date, props)} // PropTypes.func.isRequired,
              focused={focused} // PropTypes.bool
              onFocusChange={({ focused }) => setFocused(focused)} // PropTypes.func.isRequired
              numberOfMonths={1}
              customInputIcon={<img src={GREY_DATE_PICKER_ICON} />}
              screenReaderInputMessage={' '}
              renderMonthElement={_returnMonthDropdown}
              hideKeyboardShortcutsPanel={true}
              readOnly={true}
              id="date-picker" // PropTypes.string.isRequired,
              displayFormat={dateFormat.MM_DD_YYYY}
              inputIconPosition="after"
              placeholder={placeholder}
              withPortal={true}
              disabled={isDisabled}
            />
          </div>
        </div>
        {!!errorMsg && <p className="help">{errorMsg}</p>}
      </div>
    </React.Fragment>
  );
};

const _resetFilter = props => {
  const { fieldName, onChange } = props;

  onChange(fieldName, null);
};

const _isOutsideRange = date => {
  if (moment(date).isAfter(dateUtils.getCurrentDate(), 'day')) {
    return true;
  }

  return false;
};

const _returnMonthDropdown = ({ month, onMonthSelect, onYearSelect }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div>
      <select value={month.month()} onChange={e => onMonthSelect(month, e.target.value)}>
        {moment.months().map((label, value) => (
          <option key={`month_${value}`} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
    <div>
      <select value={month.year()} onChange={e => onYearSelect(month, e.target.value)}>
        {_returnYearsDropdown()}
      </select>
    </div>
  </div>
);

const _returnYearsDropdown = () => {
  const years = [];
  const futureYears = 0;
  const currentYear = moment().year();
  const maxYear = currentYear + futureYears;

  for (let i = currentYear - 100; i <= maxYear; i++) {
    years.push(
      <option key={`year_${i}`} value={i}>
        {i}
      </option>
    );
  }

  return years;
};

const handleChange = (date, props) => {
  const { fieldName, onChange } = props;

  onChange(fieldName, date);
};

export default DatePicker;
