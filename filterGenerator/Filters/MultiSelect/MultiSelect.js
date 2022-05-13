import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash.isempty';

import { keyCode } from '../../../../../constants/keyCode';
import { DROP_DOWN_ARROW } from '../../../../../constants/images';

const DropdownIndicator = () => {
  return <img className="dropdown-arrow" src={DROP_DOWN_ARROW} alt="arrow" />;
};

const customStyles = {
  container: (style, state) => ({
    ...style,
    pointerEvents: 'auto',
    cursor: state.isDisabled ? 'not-allowed' : 'auto',
  }),
  control: (style, state) => ({
    ...style,
    border: 0,
    minHeight: '20px',
    backgroundColor: state.isDisabled ? '#e4e8e9' : 'transparent',
    boxShadow: state.isFocused ? '0 0 0 1px black' : 'none',
    pointerEvents: 'auto',
    cursor: state.isDisabled ? 'not-allowed' : 'auto',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  menu: style => ({
    ...style,
    border: '1px solid #979797',
    boxShadow: 'none',
    padding: '10px 0',
    borderRadius: '5px',
  }),
  menuList: () => ({
    boxSizing: 'border-box',
    borderRadius: '5px',
    maxHeight: '280px',
    overflow: 'auto',
  }),
  dropdownIndicator: style => ({
    ...style,
    color: '#979797',
    padding: '0 8px',
  }),
  option: style => ({
    ...style,
    fontFamily: 'Noto Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '20px',
    color: '#000000',
  }),
  multiValueRemove: styles => ({
    ...styles,
    ':hover': {
      ...styles,
      color: '#ac0e07',
    },
  }),
  singleValue: styles => ({
    ...styles,
    fontFamily: 'Noto Sans',
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '12px',
    lineHeight: '20px',
    color: '#000000',
  }),
};

class MultiSelect extends React.Component {
  render = () => {
    const { options, label, placeholder, value, errorMsg, isDisabled, isStrict, showStrict } = this.props;

    return (
      <div className={'form-group ' + (this.props.errorMsg ? 'has-error' : '')}>
        <div className={'label-wrapper'}>
          <label htmlFor="input1" className="form-group__label form-group__label--block">
            {label}
          </label>

          {showStrict && (
            <div className="strict">
              <input type="checkbox" onChange={this._setStrict} checked={isStrict} />
              <span>Strict</span>
            </div>
          )}
        </div>
        <Select
          classNamePrefix="input-field-select"
          components={{ DropdownIndicator }}
          options={options}
          isMulti
          isClearable={true}
          isDisabled={isDisabled}
          placeholder={placeholder}
          value={value}
          onChange={this._handleChange}
          onKeyDown={this._handleKeyDown}
          className={'multi-select'}
          styles={customStyles}
          isSearchable={true}
        />
        {!!errorMsg && <p className="help">{errorMsg}</p>}
      </div>
    );
  };

  _setStrict = () => {
    const { fieldName, isStrict } = this.props;

    this.props.setStrict(fieldName, !isStrict);
  };

  _handleChange = selectedOption => {
    const { fieldName } = this.props;

    _isEmpty(selectedOption) ? this.props.onChange(fieldName, null) : this.props.onChange(fieldName, selectedOption);
  };

  _handleKeyDown = event => {
    const { searchOnEnter } = this.props;

    // Prevents error exception while entering space
    if (event.keyCode === keyCode.SPACE && event.target.value === '') {
      event.preventDefault();
    }

    if (searchOnEnter && event.key === keyCode.ENTER) {
      const value = event.target.value;

      if ((!value && this.props.value) || !value) {
        setTimeout(() => {
          this.props.handleShow();
        }, 0);
      }
    }
  };
}

MultiSelect.defaultProps = {
  placeholder: '',
};

MultiSelect.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.array,
  errorMsg: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  setStrict: PropTypes.func,
};

export default MultiSelect;
