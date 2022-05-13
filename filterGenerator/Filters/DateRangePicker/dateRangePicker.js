import moment from 'moment';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { DateRangePicker } from 'react-dates';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import * as dateUtils from '../../../../../utils/date';
import { ERASER } from '../../../../../constants/images';

// import style after _datepicker
import './style.css';

class DatePicker extends Component {
  state = {
    focused: null,
  };

  render() {
    /* eslint-disable no-unused-vars*/
    const {
      label,
      value,
      errorMsg,
      parentWidth,
      fieldName,
      filterType,
      handleShow,
      isDisabled,
      onChange,
      tab,
      fixedMaxDate,
      ...otherProps
    } = this.props;
    /* enable-eslint no-unused-vars*/
    // Adding moment so that the values are always moment object rather than string.
    const minValue = value.min ? moment(value.min) : null;
    const maxValue = value.max ? moment(value.max) : null;

    delete otherProps.setStrict;

    // Note: filter section width threshold is 320 for window width of 1600
    const thresholdWidth = 320;
    const withPortal = this.props.withPortal ? this.props.withPortal : parentWidth < thresholdWidth;

    return (
      <React.Fragment>
        <div className={'form-group ' + (errorMsg ? 'has-error' : '')}>
          <div className="label-wrapper">
            <label className="form-group__label form-group__label--block">{label}</label>
            {(minValue || maxValue) && <img alt="Clear" className="clear" src={ERASER} onClick={this._resetFilter} />}
          </div>
          <div className="block__content date-range-picker">
            <DateRangePicker
              isOutsideRange={this._isOutsideRange}
              startDate={minValue} // momentPropTypes.momentObj or null,
              startDateId={`${fieldName}_start_date`} // PropTypes.string.isRequired,
              endDate={maxValue} // momentPropTypes.momentObj or null,
              endDateId={`${fieldName}_end_date`} // PropTypes.string.isRequired,
              onDatesChange={event => this._handleChange(event)} // PropTypes.func.isRequired,
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
              numberOfMonths={1}
              small={true}
              customArrowIcon={null}
              inputIconPosition="after"
              screenReaderInputMessage={' '}
              minimumNights={0}
              renderMonthElement={this._returnMonthDropdown}
              hideKeyboardShortcutsPanel={true}
              readOnly={true}
              // openDirection= {'OPEN_UP'}
              withPortal={withPortal}
              // initialVisibleMonth used to control what year/month calendar they see initially
              // initialVisibleMonth={this.props.maxDate ? () => moment(this.props.maxDate) : null}
              {...otherProps}
              maxDate={this._getParsedMaxDate()}
            />
          </div>
          {!!errorMsg && <p className="help">{errorMsg}</p>}
        </div>
      </React.Fragment>
    );
  }

  _isOutsideRange = date => {
    if (moment(date).isAfter(this._getParsedMaxDate(), 'day')) {
      return true;
    }

    if (moment(date).isBefore(this._getParsedMinDate(), 'day')) {
      return true;
    }

    return false;
  };

  _handleChange = event => {
    const { fieldName } = this.props;
    const val = { max: event.endDate, min: event.startDate };

    this.props.onChange(fieldName, val);
  };

  _resetFilter = () => {
    const { fieldName } = this.props;

    this.props.onChange(fieldName, {
      max: null,
      min: null,
    });
  };

  _returnYearsDropdown = () => {
    const years = [];
    const futureYears = 1;
    const currentYear = moment().year();
    const maxYear = this._getParsedMaxDate() ? currentYear : currentYear + futureYears;

    for (let i = currentYear - 100; i <= maxYear; i++) {
      years.push(
        <option key={`year_${i}`} value={i}>
          {i}
        </option>
      );
    }

    return years;
  };

  /**
   * Returns max date as a moment object.
   */
  _getParsedMaxDate = () => {
    return this.props.maxDate
      ? this.props.fixedMaxDate
        ? moment(this.props.maxDate)
        : dateUtils.getCurrentDate()
      : null;
  };

  /**
   * Returns min date as a moment object.
   */
  _getParsedMinDate = () => {
    return this.props.minDate ? moment(this.props.minDate) : null;
  };

  _returnMonthDropdown = ({ month, onMonthSelect, onYearSelect }) => (
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
          {this._returnYearsDropdown()}
        </select>
      </div>
    </div>
  );
}

DatePicker.propTypes = {
  fieldName: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.object,
  errorMsg: PropTypes.string,
};

export default DatePicker;
