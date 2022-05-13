import React from 'react';
import _isEmpty from 'lodash.isempty';
import debounce from 'lodash.debounce';

import { keyCode } from '../../../../../constants/keyCode';
import * as filterConstants from '../../../../../constants/filterConstants';

const DEBOUNCE_TIMER = 500;

class Range extends React.Component {
  constructor(props) {
    super(props);

    this.validateMinValue = debounce(() => {
      const { value, fieldName } = this.props;

      if (value.max && parseFloat(value.min) > parseFloat(value.max)) {
        this.props.onChange(fieldName, {
          max: value.max,
          min: null,
        });
      }
    }, DEBOUNCE_TIMER);

    this.validateMaxValue = debounce(() => {
      const { value, fieldName } = this.props;

      if (value.min && parseFloat(value.max) < parseFloat(value.min)) {
        this.props.onChange(fieldName, {
          min: value.min,
          max: null,
        });
      }
    }, DEBOUNCE_TIMER);
  }
  render = () => {
    const { label, placeholder, maxLength, value, hideLabel } = this.props;
    const minValue = value.min === null ? '' : value.min;
    const maxValue = value.max === null ? '' : value.max;

    return (
      <div className="form-group range">
        <label htmlFor="input1" className="form-group__label form-group__label--block">
          {label}
        </label>
        <input
          type="text"
          className="range-min form-group__control"
          placeholder={placeholder ? placeholder.start : ''}
          maxLength={maxLength}
          onKeyPress={this._isNumberKey}
          onChange={this._handleChangeMin}
          onKeyDown={this._handleKeyDown}
          value={minValue}
        />
        {!hideLabel && <span>to</span>}
        <input
          type="text"
          className="range-max form-group__control"
          placeholder={placeholder ? placeholder.end : ''}
          maxLength={maxLength}
          onKeyPress={this._isNumberKey}
          onChange={this._handleChangeMax}
          onKeyDown={this._handleKeyDown}
          value={maxValue}
        />
      </div>
    );
  };

  _handleChangeMin = event => {
    const { fieldName, value } = this.props;
    const enteredValue = event.target.value;

    if (this._validateNum(enteredValue)) {
      const val = { max: value.max, min: enteredValue };

      this.props.onChange(fieldName, val);

      this.validateMinValue();
    }
  };

  _handleChangeMax = event => {
    const enteredValue = event.target.value;

    const { fieldName, value } = this.props;

    if (this._validateNum(enteredValue)) {
      const val = { max: enteredValue, min: value.min };

      this.props.onChange(fieldName, val);

      this.validateMaxValue();
    }
  };

  _handleKeyDown = event => {
    const { searchOnEnter, handleShow, value } = this.props;

    if (searchOnEnter && event.key === keyCode.ENTER) {
      event.preventDefault();

      if (value.max === null || value.min === null) {
        handleShow();
      } else {
        if (parseFloat(value.max) > parseFloat(value.min)) {
          handleShow();
        }
      }
    }
  };

  _isNumberKey = event => {
    const charCode = event.which ? event.which : event.keyCode;

    if (
      (charCode < filterConstants.ASCII_VALUE_FOR_0 || charCode > filterConstants.ASCII_VALUE_FOR_9) &&
      charCode !== filterConstants.ASCII_VALUE_FOR_DOT
    ) {
      event.preventDefault();

      return false;
    }

    return true;
  };

  _validateNum = value => {
    if (!_isEmpty(value)) {
      const result = value.split('.');

      return !isNaN(value) && result.length < 3;
    }

    return true;
  };
}

export default Range;
