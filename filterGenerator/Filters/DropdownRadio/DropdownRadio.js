import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { keyCode } from '../../../../../constants/keyCode';
import { DROP_DOWN_ARROW, ERASER } from '../../../../../constants/images';

class DropdownRadio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
    };

    this.dropdownRef = React.createRef();
    this.menuRef = React.createRef();
    this.labelRef = React.createRef();
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this._handleClickOutside);
  }

  render = () => {
    const { isDropdownOpen } = this.state;
    const { radioName, id, label, options, errorMessage, className, value, isClearable } = this.props;

    const selectedOption = options.find(item => item.value === value);

    return (
      <div className={'radio-dropdown form-group ' + (errorMessage ? 'has-error' : '')}>
        <div className={'label-wrapper'}>
          {this._getLabelView(label, id)}
          {!!value && isClearable && <img alt="Clear" className="clear" src={ERASER} onClick={this._resetFilter} />}
        </div>
        <div className={`radio-dropdown__wrapper ${className ? className : ''}`}>
          <div
            ref={this.menuRef}
            className="radio-dropdown__value"
            onClick={() => this._setIsDropdownOpen(!isDropdownOpen)}>
            <input
              ref={this.labelRef}
              className="label"
              type="text"
              name="selectedOption"
              value={selectedOption ? selectedOption.label : ''}
              readOnly
              onKeyDown={this._handleKeyDown}
            />
            <img className="dropdown-arrow" src={DROP_DOWN_ARROW} alt="arrow" />
          </div>
          {isDropdownOpen && (
            <div className="radio-dropdown__menu" ref={this.dropdownRef}>
              {options.map((option, i) => (
                <div key={i} className="input-wrap">
                  <input
                    type="radio"
                    id={`radio${i}`}
                    name={radioName}
                    /* eslint-disable */
                    checked={option.value == value} // For comparing string with numbers as radio always sets its value to string
                    /* eslint-enable */
                    value={option.value}
                    onKeyDown={this._handleKeyDown}
                    onChange={this._handleChange}
                  />
                  <label htmlFor={`radio${i}`}>{option.label}</label>
                </div>
              ))}
            </div>
          )}
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
    this._setIsDropdownOpen(false);
    this.labelRef.current.focus();
  };

  _resetFilter = () => {
    this.props.onChange(this.props.fieldName, null);
  };

  _handleKeyDown = event => {
    const { searchOnEnter, handleShow, value } = this.props;

    if (value && searchOnEnter && event.key === keyCode.ENTER) {
      event.preventDefault();
      this._setIsDropdownOpen(false);
      handleShow();
    }
  };

  _setIsDropdownOpen = value => {
    this.setState({
      isDropdownOpen: value,
    });

    if (value) {
      document.addEventListener('mousedown', this._handleClickOutside);
    } else {
      document.removeEventListener('mousedown', this._handleClickOutside);
    }
  };

  _handleClickOutside = event => {
    if (!(this.menuRef && this.menuRef.current && this.menuRef.current.contains(event.target))) {
      if (!(this.dropdownRef && this.dropdownRef.current && this.dropdownRef.current.contains(event.target))) {
        this._setIsDropdownOpen(false);
      }
    }
  };
}

DropdownRadio.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  errorMessage: PropTypes.string,
  className: PropTypes.string,
};

export default DropdownRadio;
