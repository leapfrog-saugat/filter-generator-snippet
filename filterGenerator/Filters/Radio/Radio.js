import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ERASER } from '../../../../../constants/images';

import { keyCode } from '../../../../../constants/keyCode';

import './style.css';

class Radio extends Component {
  render = () => {
    const { radioName, id, label, options, errorMessage, className, value, isClearable } = this.props;

    return (
      <div className={'form-group ' + (errorMessage ? 'has-error' : '')}>
        <div className={'label-wrapper'}>
          {this._getLabelView(label, id)}
          {!!value && isClearable && <img alt="Clear" className="clear" src={ERASER} onClick={this._resetFilter} />}
        </div>
        <div className={className}>
          {options.map((option, i) => (
            <div key={i} className="input-wrap">
              <input
                type="radio"
                id={`radio${i}`}
                name={radioName}
                /* eslint-disable */
                checked={value == option.value} // For comparing string with numbers as radio always sets its value to string
                /* eslint-enable */
                value={option.value}
                onKeyDown={this._handleKeyDown}
                onChange={this._handleChange}
              />
              <label htmlFor={`radio${i}`}>{option.label}</label>
            </div>
          ))}
        </div>
        {!!errorMessage && <p className={'help'}>{errorMessage}</p>}
      </div>
    );
  };

  _getLabelView = (label, id) =>
    !!label && (
      <label htmlFor={id} className={'form-group__label form-group__label--block'}>
        {label}
      </label>
    );

  _handleChange = selectedValue => {
    const fieldValue = selectedValue.target.value;

    this.props.onChange(this.props.fieldName, fieldValue);
  };

  _resetFilter = () => {
    this.props.onChange(this.props.fieldName, null);
  };

  _handleKeyDown = event => {
    const { searchOnEnter, handleShow } = this.props;

    if (searchOnEnter && event.key === keyCode.ENTER) {
      event.preventDefault();
      handleShow();
    }
  };
}

Radio.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  errorMessage: PropTypes.string,
  className: PropTypes.string,
};

export default Radio;
