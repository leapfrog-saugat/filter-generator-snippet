import React from 'react';
import PropTypes from 'prop-types';

import { keyCode } from '../../../../../constants/keyCode';
import { regexPatterns } from '../../../../../constants/regexPattern';
import { textFormats } from '../../../../../constants/filterConstants';

class InputField extends React.Component {
  render() {
    const { label, placeholder, isDisabled, type, value, errorMsg, pattern } = this.props;
    const mainValue = value === null ? '' : value.value;

    return (
      <div className={`form-group ${this.props.errorMsg ? 'has-error' : ''}`}>
        <label htmlFor="input1" className="form-group__label form-group__label--block">
          {label}
        </label>
        <input
          type={type}
          className={'form-group__control'}
          placeholder={placeholder}
          value={mainValue}
          disabled={isDisabled}
          onChange={this._handleChange}
          pattern={pattern}
          onKeyDown={this._handleKeyDown}
        />
        {!!errorMsg && <p className="help">{errorMsg}</p>}
      </div>
    );
  }

  _handleChange = event => {
    const { fieldName, format, pattern } = this.props;
    const inputValue = event.target.value;

    const _getFormattedValue = (value, format) => {
      switch (format) {
        case textFormats.UPPERCASE:
          return value && value.toUpperCase();
        case textFormats.LOWERCASE:
          return value && value.toLowerCase();
        default:
          return value;
      }
    };

    const updatedValue = inputValue.trim()
      ? pattern === regexPatterns.INTEGER && event.target.validity.valid
        ? { value: inputValue.trim() }
        : { value: _getFormattedValue(inputValue, format) }
      : null;

    this.props.onChange(fieldName, updatedValue);
  };

  _handleKeyDown = event => {
    if (event.key === keyCode.ENTER && this.props.searchOnEnter) {
      this.props.handleShow();
    }
  };
}

InputField.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  type: PropTypes.string,
  value: PropTypes.object,
  errorMsg: PropTypes.string,
  pattern: PropTypes.string,
};

export default InputField;
